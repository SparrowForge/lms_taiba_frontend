'use client';

import {Button, Checkbox, Form, Input, InputNumber, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ENTITY_STATUS_OPTIONS} from '@/constants/statusOptions';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {useWeekDays} from '@/hooks/useWeekDays';

import {getErrorMessage} from '@/types/errors';
import {IWeekDay, IWeekDayCreate, IWeekDayUpdate} from '@/types/weekDay';

import FormLayout from '../layout/FormLayout';
import {StatusSelectFormItem} from '../ui/StatusSelect';

interface Props {
  mode: 'create' | 'edit';
  weekDayId?: number;
  initialValues?: Partial<IWeekDayCreate | IWeekDayUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const WeekDayForm: React.FC<Props> = ({
  mode,
  weekDayId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createWeekDay, editWeekDay, actionStatus } = useWeekDays();

  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IWeekDay>) => {
    try {
      if (mode === 'create') {
        await createWeekDay(values as IWeekDayCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/week-days');
      } else if (mode === 'edit' && weekDayId) {
        await editWeekDay(weekDayId, values as IWeekDayUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/week-days/${weekDayId}`);
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

      <Form.Item
        name="dayNumber"
        label={t(LOCALE_KEYS.DAY_NUMBER)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DAY_NUMBER) }),
          },
          { type: 'number', min: 1, max: 7, message: 'Day number must be between 1 and 7' },
        ]}
      >
        <InputNumber min={1} max={7} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="isWorkingDay" label={t(LOCALE_KEYS.IS_WORKING_DAY)} valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <Input.TextArea rows={3} />
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

export default WeekDayForm;
