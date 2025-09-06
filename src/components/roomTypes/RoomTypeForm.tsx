'use client';

import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ENTITY_STATUS_OPTIONS} from '@/constants/statusOptions';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoomTypes} from '@/hooks/useRoomTypes';

import {getErrorMessage} from '@/types/errors';
import {IRoomType, IRoomTypeCreate, IRoomTypeUpdate} from '@/types/roomType';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';

interface Props {
  mode: 'create' | 'edit';
  roomTypeId?: number;
  initialValues?: Partial<IRoomTypeCreate | IRoomTypeUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const RoomTypeForm: React.FC<Props> = ({
  mode,
  roomTypeId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createRoomType, editRoomType, actionStatus } = useRoomTypes();

  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IRoomType>) => {
    try {
      if (mode === 'create') {
        await createRoomType(values as IRoomTypeCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/room-types');
      } else if (mode === 'edit' && roomTypeId) {
        await editRoomType(roomTypeId, values as IRoomTypeUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/room-types/${roomTypeId}`);
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) errorMessage = apiError.response.data.message;
      } else {
        errorMessage = getErrorMessage(error);
      }
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };
  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={mode === 'edit' ? initialValues : undefined}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default RoomTypeForm;
