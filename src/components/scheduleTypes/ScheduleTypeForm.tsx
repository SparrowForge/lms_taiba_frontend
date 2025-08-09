'use client';

import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';


import StatusSelect from '@/components/ui/StatusSelect';

import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IScheduleType, IScheduleTypeCreate, IScheduleTypeUpdate} from '@/types/scheduleType';

import FormLayout from '../layout/FormLayout';

interface Props {
  mode: 'create' | 'edit';
  scheduleTypeId?: number;
  initialValues?: Partial<IScheduleTypeCreate | IScheduleTypeUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const ScheduleTypeForm: React.FC<Props> = ({
  mode,
  scheduleTypeId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('scheduleType');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createScheduleType, editScheduleType, actionStatus } = useScheduleTypes();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
  }, [initialValues, form]);
  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IScheduleType>) => {
    try {
      if (mode === 'create') {
        await createScheduleType(values as IScheduleTypeCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/schedule-types');
      } else if (mode === 'edit' && scheduleTypeId) {
        await editScheduleType(scheduleTypeId, values as IScheduleTypeUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/schedule-types/${scheduleTypeId}`);
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
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
      ? t('create_name', { name: entityName })
      : t('update_name', { name: entityName });

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('required_name', { name: t('name') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label={t('status')}
        rules={[{ required: true, message: t('required_name', { name: t('status') }) }]}
      >
        <StatusSelect preset="binary" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t('cancel')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default ScheduleTypeForm;
