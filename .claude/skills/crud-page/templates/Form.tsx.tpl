'use client';

import { Button, Form, Input, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { use__PascalPlural__ } from '@/hooks/use__PascalPlural__';

import { getErrorMessage } from '@/types/errors';
import {
  I__PascalSingular__,
  I__PascalSingular__Create,
  I__PascalSingular__Update,
} from '@/types/__camelSingular__';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';

interface Props {
  mode: 'create' | 'edit';
  __camelSingular__Id?: number;
  initialValues?: Partial<I__PascalSingular__Create | I__PascalSingular__Update>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const __PascalSingular__Form: React.FC<Props> = ({
  mode,
  __camelSingular__Id,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.__CONST_SINGULAR__, { defaultValue: '__TitleSingular__' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { create__PascalSingular__, edit__PascalSingular__, actionStatus } = use__PascalPlural__();

  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  const handleSubmit = async (values: Partial<I__PascalSingular__>) => {
    try {
      if (mode === 'create') {
        await create__PascalSingular__(values as I__PascalSingular__Create);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/__kebabPlural__');
      } else if (mode === 'edit' && __camelSingular__Id) {
        await edit__PascalSingular__(__camelSingular__Id, values as I__PascalSingular__Update);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/__kebabPlural__/${__camelSingular__Id}`);
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

export default __PascalSingular__Form;
