'use client';

import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';


import {LOCALE_KEYS} from '@/constants/localizationKeys';

import StatusSelect from '@/components/ui/StatusSelect';

import {useInstitutes} from '@/hooks/useInstitutes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IInstitute, IInstituteCreate, IInstituteUpdate} from '@/types/institute';

import FormLayout from '../layout/FormLayout';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.INSTITUTE, { defaultValue: 'Institute' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createInstitute, editInstitute, actionStatus } = useInstitutes();

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
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.NAME) }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.STATUS) }) }]}
      >
        <StatusSelect preset="binary" />
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

  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default InstituteForm;
