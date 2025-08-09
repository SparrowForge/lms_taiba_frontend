'use client';

import {Button, Form, Input, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import StatusSelect from '@/components/ui/StatusSelect';

import {useBranches} from '@/hooks/useBranches';
import {useDepartments} from '@/hooks/useDepartments';
import {useFaculties} from '@/hooks/useFaculties';

import {Status} from '@/types/common';
import {IDepartment, IDepartmentCreate, IDepartmentUpdate} from '@/types/department';
import {getErrorMessage} from '@/types/errors';


interface DepartmentFormProps {
  mode: 'create' | 'edit';
  departmentId?: number;
  initialValues?: Partial<IDepartmentCreate | IDepartmentUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  mode,
  departmentId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('department');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createDepartment, editDepartment, actionStatus } = useDepartments();
  const { branches, loadBranches } = useBranches();
  const { faculties, loadFaculties } = useFaculties();

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

  useEffect(() => {
    loadFaculties({ page: 1, limit: 100 });
  }, [loadFaculties]);

  const handleSubmit = async (values: Partial<IDepartment>) => {
    try {
      if (mode === 'create') {
        await createDepartment(values as IDepartmentCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/departments');
        }
      } else if (mode === 'edit' && departmentId) {
        await editDepartment(departmentId, values as IDepartmentUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/departments/${departmentId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

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

  const getSubmitText = () =>
    mode === 'create'
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const formContent = (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues}>
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
        name="code"
        label={t('code')}
        rules={[{ required: true, message: t('required_field', { field: t('code') }) }]}
      >
        <Input placeholder={t('enter_code')} />
      </Form.Item>

      <Form.Item
        name="headId"
        label={t('head')}
        rules={[{ required: true, message: t('required_name', { name: t('head') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('head') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {faculties.map((f) => (
            <Select.Option key={f.id} value={f.id}>
              {f.fullName} ({f.employeeCode})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="email"
        label={t('email')}
        rules={[{ required: true, message: t('required_name', { name: t('email') }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label={t('phone')}
        rules={[{ required: true, message: t('required_name', { name: t('phone') }) }]}
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
          <Button onClick={handleCancel}>{t('cancel')}</Button>
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
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {formContent}
      </div>
    </div>
  );
};

export default DepartmentForm;
