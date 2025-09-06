'use client';

import {Button, Form, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoles} from '@/hooks/useRoles';
import {useUserRoles} from '@/hooks/useUserRoles';
import {useUsers} from '@/hooks/useUsers';

import {getErrorMessage} from '@/types/errors';
import {IUserRole, IUserRoleCreate, IUserRoleUpdate} from '@/types/userRole';

import {UserRoleFormProps} from './UserRoleFormTabView';

function UserRoleFormSingle({
  mode,
  userRoleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}: UserRoleFormProps) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE);
  const router = useRouter();
  const [singleForm] = Form.useForm();
  const { createUserRole, editUserRole, actionStatus } = useUserRoles();
  const { users, loadUsers } = useUsers();
  const { roles, loadRoles } = useRoles();

  useEffect(() => {
    loadUsers({ page: 1, limit: 100 });
    loadRoles({ page: 1, limit: 100 });
  }, [loadUsers, loadRoles]);

  const handleSingleSubmit = async (values: Partial<IUserRole>) => {
    try {
      console.log('=== SINGLE ROLE SUBMISSION START ===');
      console.log('Form values:', values);

      const submitData = {
        userId: values.userId,
        roleId: values.roleId,
      };

      console.log('Single role submission data:', submitData);

      if (mode === 'create') {
        await createUserRole(submitData as IUserRoleCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));

        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/user-roles');
        }
      } else if (mode === 'edit' && userRoleId) {
        await editUserRole(userRoleId, submitData as IUserRoleUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));

        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/user-roles/${userRoleId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
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
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  return (
    <Form
      form={singleForm}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSingleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="userId"
        label={t(LOCALE_KEYS.USER)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_USER) }]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_USER)}
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
        label={t(LOCALE_KEYS.ROLE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_SELECT_ROLE) }]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_ROLE)}
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
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default UserRoleFormSingle;
