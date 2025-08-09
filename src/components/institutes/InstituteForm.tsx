'use client';

import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';


import StatusSelect from '@/components/ui/StatusSelect';

import {useInstitutes} from '@/hooks/useInstitutes';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IInstitute, IInstituteCreate, IInstituteUpdate} from '@/types/institute';

interface Props {
  mode: 'create' | 'edit';
  instituteId?: number;
  initialValues?: Partial<IInstituteCreate | IInstituteUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const InstituteForm: React.FC<Props> = ({
  mode,
  instituteId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('institute');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createInstitute, editInstitute, actionStatus } = useInstitutes();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
  }, [initialValues, form]);
  useEffect(() => {
    if (mode === 'create') form.resetFields();
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IInstitute>) => {
    try {
      if (mode === 'create') {
        await createInstitute(values as IInstituteCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/institutes');
      } else if (mode === 'edit' && instituteId) {
        await editInstitute(instituteId, values as IInstituteUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/institutes/${instituteId}`);
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
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          background: '#fff',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {formContent}
      </div>
    </div>
  );
};

export default InstituteForm;
