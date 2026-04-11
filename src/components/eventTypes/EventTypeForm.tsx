'use client';

import { Button, Form, Input, InputNumber, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import FormLayout from '@/components/layout/FormLayout';
import { StatusSelectFormItem } from '@/components/ui/StatusSelect';

import { useEventTypes } from '@/hooks/useEventTypes';
import { useLocalization } from '@/hooks/useLocalization';

import { getErrorMessage } from '@/types/errors';
import { IEventType, IEventTypeCreate, IEventTypeUpdate } from '@/types/eventType';

interface EventTypeFormProps {
  mode: 'create' | 'edit';
  eventTypeId?: number;
  initialValues?: Partial<IEventTypeCreate | IEventTypeUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const EventTypeForm: React.FC<EventTypeFormProps> = ({
  mode,
  eventTypeId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EVENT_TYPE, { defaultValue: 'Event Type' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createEventType, editEventType, actionStatus } = useEventTypes();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IEventType>) => {
    try {
      if (mode === 'create') {
        await createEventType(values as IEventTypeCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/event-types');
      } else if (mode === 'edit' && eventTypeId) {
        await editEventType(eventTypeId, values as IEventTypeUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/event-types/${eventTypeId}`);
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
        <Input placeholder={t(LOCALE_KEYS.NAME)} />
      </Form.Item>

      <Form.Item
        name="color"
        label="Color"
        rules={[
          { required: true, message: 'Please pick a color' },
        ]}
      >
        <Input type="color" style={{ width: 80 }} />
      </Form.Item>

      <Form.Item
        name="sortOrder"
        label="Sort Order"
        rules={[
          { required: true, message: 'Please enter sort order' },
        ]}
      >
        <InputNumber min={1} max={1000} style={{ width: '100%' }} />
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <Input.TextArea rows={3} />
      </Form.Item>

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

export default EventTypeForm;

