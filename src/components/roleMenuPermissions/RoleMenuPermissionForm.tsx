'use client';

import {Button, Checkbox, Form, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';
import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IRoleMenuPermissionCreate, IRoleMenuPermissionUpdate,} from '@/types/roleMenuPermission';

import FormLayout from '../layout/FormLayout';

interface RoleMenuPermissionFormProps {
  mode: 'create' | 'edit';
  roleMenuPermissionId?: number;
  initialValues?: Partial<IRoleMenuPermissionCreate | IRoleMenuPermissionUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const RoleMenuPermissionForm: React.FC<RoleMenuPermissionFormProps> = ({
  mode,
  roleMenuPermissionId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createRoleMenuPermission, editRoleMenuPermission, actionStatus } =
    useRoleMenuPermissions();
  const { roles, loadRoles } = useRoles();
  const { menus, loadMenus } = useMenus();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadRoles({ page: 1, limit: 100 });
    loadMenus({ page: 1, limit: 100 });
  }, [loadRoles, loadMenus]);

  const handleSubmit = async (values: Partial<IRoleMenuPermissionCreate | IRoleMenuPermissionUpdate>) => {
    try {
      if (mode === 'create') {
        await createRoleMenuPermission(values as IRoleMenuPermissionCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/role-menu-permissions');
        }
      } else if (mode === 'edit' && roleMenuPermissionId) {
        await editRoleMenuPermission(roleMenuPermissionId, values as IRoleMenuPermissionUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/role-menu-permissions/${roleMenuPermissionId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
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
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  const formContent = (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={mode === 'edit' ? initialValues : undefined}>
      {mode === 'create' && (
        <>
          <Form.Item
            name="roleId"
            label={t(LOCALE_KEYS.ROLE)}
            rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.ROLE) }) }]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ROLE) })}
              loading={roles.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name} ({role.branch?.name})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="menuId"
            label={t(LOCALE_KEYS.MENU)}
            rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.MENU) }) }]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.MENU) })}
              loading={menus.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {menus.map((menu) => (
                <Select.Option key={menu.id} value={menu.id}>
                  {menu.name} ({menu.panel?.name})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item name="view" valuePropName="checked" label={t(LOCALE_KEYS.VIEW)}>
        <Checkbox>{t(LOCALE_KEYS.ALLOW_VIEW)}</Checkbox>
      </Form.Item>

      <Form.Item name="insert" valuePropName="checked" label={t(LOCALE_KEYS.INSERT)}>
        <Checkbox>{t(LOCALE_KEYS.ALLOW_INSERT)}</Checkbox>
      </Form.Item>

      <Form.Item name="update" valuePropName="checked" label={t(LOCALE_KEYS.UPDATE)}>
        <Checkbox>{t(LOCALE_KEYS.ALLOW_UPDATE)}</Checkbox>
      </Form.Item>

      <Form.Item name="delete" valuePropName="checked" label={t(LOCALE_KEYS.DELETE)}>
        <Checkbox>{t(LOCALE_KEYS.ALLOW_DELETE)}</Checkbox>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
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

export default RoleMenuPermissionForm;
