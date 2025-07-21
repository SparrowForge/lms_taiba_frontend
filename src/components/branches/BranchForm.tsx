'use client';

import React, { useEffect } from 'react';
import { Button, Form, Input, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useBranches } from '@/hooks/useBranches';
import { IBranch, IBranchCreate, IBranchUpdate } from '@/types/branch';
import { Status } from '@/types/common';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { getErrorMessage } from '@/types/errors';

interface BranchFormProps {
  mode: 'create' | 'edit';
  branchId?: number;
  initialValues?: Partial<IBranchCreate | IBranchUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const BranchForm: React.FC<BranchFormProps> = ({
  mode,
  branchId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false
}) => {
  const t = useTranslations();
  const entityName = t('branch');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createBranch, editBranch, actionStatus } = useBranches();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IBranch>) => {
    try {
      if (mode === 'create') {
        await createBranch(values as IBranchCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/branches');
        }
      } else if (mode === 'edit' && branchId) {
        await editBranch(branchId, values as IBranchUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/branches/${branchId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', { name: entityName, defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}` });
      
      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        // Use the helper function for other error types
        errorMessage = getErrorMessage(error);
      }
      
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const getSubmitText = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      aria-label={`${mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName })} form`}
      role="form"
    >
      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('pleaseEnterName_name', { name: entityName }) }]}
      >
        <Input
          placeholder={t('name')}
          aria-label={t('name')}
          aria-required="true"
        />
      </Form.Item>

      <Form.Item
        name="location"
        label={t('location')}
        rules={[{ required: true, message: t('pleaseEnterLocation') }]}
      >
        <Input
          placeholder={t('location')}
          aria-label={t('location')}
          aria-required="true"
        />
      </Form.Item>

      <Form.Item
        name="code"
        label={t('code')}
        rules={[{ required: true, message: t('pleaseEnterCode') }]}
      >
        <Input
          placeholder={t('code')}
          aria-label={t('code')}
          aria-required="true"
        />
      </Form.Item>

      <Form.Item style={{ marginTop: '32px', textAlign: embedded ? 'right' : 'center' }}>
        <Space size={embedded ? 'small' : 'large'}>
          <Button
            type="primary"
            htmlType="submit"
            size={embedded ? 'middle' : 'large'}
            style={{ minWidth: embedded ? '80px' : '120px' }}
            loading={actionStatus.status === Status.LOADING}
            aria-label={`${getSubmitText()} button`}
          >
            {getSubmitText()}
          </Button>
          <Button
            onClick={handleCancel}
            size={embedded ? 'middle' : 'large'}
            style={{ minWidth: embedded ? '80px' : '120px' }}
            aria-label={t('cancel', { defaultValue: 'Cancel' }) + ' button'}
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {formContent}
      </div>
    </div>
  );
};

export default BranchForm; 