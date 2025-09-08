'use client';

import { Button, Form, Input, Space, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useTimeSlots } from '@/hooks/useTimeSlots';

import { getErrorMessage } from '@/types/errors';
import { ITimeSlot, ITimeSlotCreate, ITimeSlotUpdate } from '@/types/timeSlot';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';

interface Props {
  mode: 'create' | 'edit';
  timeSlotId?: number;
  initialValues?: Partial<ITimeSlotCreate | ITimeSlotUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const TimeSlotForm: React.FC<Props> = ({
  mode,
  timeSlotId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.TIME_SLOT, { defaultValue: 'Time Slot' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createTimeSlot, editTimeSlot, actionStatus } = useTimeSlots();

  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  const handleSubmit = async (values: Partial<ITimeSlot>) => {
    try {
      // Convert dayjs objects to time strings
      const formData = {
        ...values,
        startTime: values.startTime ? dayjs(values.startTime).format('HH:mm:ss') : undefined,
        endTime: values.endTime ? dayjs(values.endTime).format('HH:mm:ss') : undefined,
      };

      if (mode === 'create') {
        await createTimeSlot(formData as ITimeSlotCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/time-slots');
      } else if (mode === 'edit' && timeSlotId) {
        await editTimeSlot(timeSlotId, formData as ITimeSlotUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/time-slots/${timeSlotId}`);
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

  // Convert time strings to dayjs objects for form display
  const getFormInitialValues = () => {
    if (mode === 'edit' && initialValues) {
      return {
        ...initialValues,
        startTime: initialValues.startTime ? dayjs(initialValues.startTime, 'HH:mm:ss') : undefined,
        endTime: initialValues.endTime ? dayjs(initialValues.endTime, 'HH:mm:ss') : undefined,
      };
    }
    return undefined;
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={getFormInitialValues()}
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
        <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.NAME) })} />
      </Form.Item>

      <Form.Item
        name="startTime"
        label={t(LOCALE_KEYS.START_TIME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.START_TIME) }),
          },
        ]}
      >
        <TimePicker
          format="HH:mm"
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.START_TIME) })}
        />
      </Form.Item>

      <Form.Item
        name="endTime"
        label={t(LOCALE_KEYS.END_TIME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.END_TIME) }),
          },
        ]}
      >
        <TimePicker
          format="HH:mm"
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.END_TIME) })}
        />
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

export default TimeSlotForm;
