'use client';

import {Button, Checkbox, Form, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {useMenus} from '@/hooks/useMenus';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';
import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IRoleMenuPermissionCreate, IRoleMenuPermissionUpdate,} from '@/types/roleMenuPermission';

import FormLayout from '../layout/FormLayout';

interface RoleMenuPermissionFormProps {
  mode: 'create' | 'edit';
  id?: number;
  initialValues?: Partial<IRoleMenuPermissionCreate | IRoleMenuPermissionUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const RoleMenuPermissionForm: React.FC<RoleMenuPermissionFormProps> = ({
  mode,
  id,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('roleMenuPermission');
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
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/role-menu-permissions');
        }
      } else if (mode === 'edit' && id) {
        await editRoleMenuPermission(id, values as IRoleMenuPermissionUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/role-menu-permissions/${id}`);
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
      : t('update_name', { name: entityName });

  const formContent = (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={mode === 'edit' ? initialValues : undefined}>
      {mode === 'create' && (
        <>
          <Form.Item
            name="roleId"
            label={t('role')}
            rules={[{ required: true, message: t('required_field', { field: t('role') }) }]}
          >
            <Select
              placeholder={t('select_role')}
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
            label={t('menu')}
            rules={[{ required: true, message: t('required_field', { field: t('menu') }) }]}
          >
            <Select
              placeholder={t('select_menu')}
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

      <Form.Item name="view" valuePropName="checked" label={t('view')}>
        <Checkbox>{t('allow_view')}</Checkbox>
      </Form.Item>

      <Form.Item name="insert" valuePropName="checked" label={t('insert')}>
        <Checkbox>{t('allow_insert')}</Checkbox>
      </Form.Item>

      <Form.Item name="update" valuePropName="checked" label={t('update')}>
        <Checkbox>{t('allow_update')}</Checkbox>
      </Form.Item>

      <Form.Item name="delete" valuePropName="checked" label={t('delete')}>
        <Checkbox>{t('allow_delete')}</Checkbox>
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
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default RoleMenuPermissionForm;
