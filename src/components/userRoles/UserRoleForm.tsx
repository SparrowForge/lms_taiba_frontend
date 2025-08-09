'use client';

import {Button, Form, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {useRoles} from '@/hooks/useRoles';
import {useUserRoles} from '@/hooks/useUserRoles';
import {useUsers} from '@/hooks/useUsers';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IUserRole, IUserRoleCreate, IUserRoleUpdate} from '@/types/userRole';

import FormLayout from '../layout/FormLayout';

interface UserRoleFormProps {
  mode: 'create' | 'edit';
  userRoleId?: number;
  initialValues?: Partial<IUserRoleCreate | IUserRoleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const UserRoleForm: React.FC<UserRoleFormProps> = ({
  mode,
  userRoleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('userRole');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createUserRole, editUserRole, actionStatus } = useUserRoles();
  const { users, loadUsers } = useUsers();
  const { roles, loadRoles } = useRoles();

  useEffect(() => {
    loadUsers({ page: 1, limit: 100 });
    loadRoles({ page: 1, limit: 100 });
  }, [loadUsers, loadRoles]);

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

  const handleSubmit = async (values: Partial<IUserRole>) => {
    try {
      if (mode === 'create') {
        await createUserRole(values as IUserRoleCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/user-roles');
        }
      } else if (mode === 'edit' && userRoleId) {
        await editUserRole(userRoleId, values as IUserRoleUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/user-roles/${userRoleId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
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
        name="userId"
        label={t('user')}
        rules={[{ required: true, message: t('pleaseSelectUser') }]}
      >
        <Select
          showSearch
          placeholder={t('select_user')}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {`${user.firstName} ${user.lastName} (${user.email})`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label={t('role')}
        rules={[{ required: true, message: t('pleaseSelectRole') }]}
      >
        <Select
          showSearch
          placeholder={t('select_role')}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {roles.map((role) => (
            <Select.Option key={role.id} value={role.id}>
              {`${role.name} - ${role.description}`}
            </Select.Option>
          ))}
        </Select>
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

export default UserRoleForm;
