'use client';

import React, {useEffect} from 'react';
import {Button, Form, Input, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useRoles} from '@/hooks/useRoles';
import {useBranches} from '@/hooks/useBranches';
import {IRole, IRoleCreate, IRoleUpdate} from '@/types/role';
import {Status} from '@/types/common';
import {toast} from 'react-toastify';
import {useTranslations} from 'next-intl';
import {getErrorMessage} from '@/types/errors';

interface RoleFormProps {
  mode: 'create' | 'edit';
  roleId?: number;
  initialValues?: Partial<IRoleCreate | IRoleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
  mode,
  roleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false
}) => {
  const t = useTranslations();
  const entityName = t('role');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createRole, editRole, actionStatus } = useRoles();
  const { branches, loadBranches } = useBranches();

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

  useEffect(() => {
    if (branches.length === 0) {
      loadBranches();
    }
  }, [branches.length, loadBranches]);

  const handleSubmit = async (values: Partial<IRole>) => {
    try {
      if (mode === 'create') {
        await createRole(values as IRoleCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/roles');
        }
      } else if (mode === 'edit' && roleId) {
        await editRole(roleId, values as IRoleUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/roles/${roleId}`);
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
    >
      <Form.Item
        name="branchId"
        label={t('branch')}
        rules={[{ required: true, message: t('required_field', { field: t('branch') }) }]}
      >
        <Select
          placeholder={t('select_branch')}
          loading={branches.length === 0}
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {branches.map((branch) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name} ({branch.code})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('required_field', { field: t('name') }) }]}
      >
        <Input placeholder={t('enter_name', { name: t('name') })} />
      </Form.Item>

      <Form.Item
        name="description"
        label={t('description')}
        rules={[{ required: true, message: t('required_field', { field: t('description') }) }]}
      >
        <Input.TextArea
          placeholder={t('enter_description')}
          rows={4}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={actionStatus.status === Status.LOADING}
          >
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>
            {t('cancel')}
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

export default RoleForm;
