import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Checkbox, Form, Select, Space} from 'antd';
import {useForm} from 'antd/es/form/Form';
import router from 'next/router';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';
import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IMenu} from '@/types/menu';
import {IRoleMenuPermissionCreate, IRoleMenuPermissionUpdate} from '@/types/roleMenuPermission';

import {RoleMenuPermissionFormProps} from './RoleMenuPermissionFormTabView';

function RoleMenuPermissionFormSingle({
  mode,
  roleMenuPermissionId,
  initialValues,
  onSuccess,
  onCancel,
  embedded,
}: RoleMenuPermissionFormProps) {
  const { t } = useLocalization();
  const [form] = useForm();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });

  const { roles, loadRoles } = useRoles();
  const { menus, loadMenus } = useMenus();
  const { createRoleMenuPermission, editRoleMenuPermission, actionStatus } =
    useRoleMenuPermissions();

  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: t(LOCALE_KEYS.ROLE_MENU_PERMISSIONS) })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: t(LOCALE_KEYS.ROLE_MENU_PERMISSIONS) });

  const handleSubmit = async (
    values: Partial<IRoleMenuPermissionCreate | IRoleMenuPermissionUpdate>,
  ) => {
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

  useEffect(() => {
    loadRoles({ page: 1, limit: 100 });
    loadMenus({ page: 1, limit: 100 });
  }, [loadRoles, loadMenus]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
    >
      {mode === 'create' && (
        <>
          <Form.Item
            name="roleId"
            label={t(LOCALE_KEYS.ROLE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ROLE) }),
              },
            ]}
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
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MENU) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.MENU) })}
              loading={menus.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {menus.map((menu: IMenu) => (
                <Select.Option key={menu.id} value={menu.id}>
                  {menu.name} ({menu.panel?.name})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}

      {/* Permissions Section */}
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
          }}
        >
          {t(LOCALE_KEYS.ROLE_MENU_PERMISSIONS)}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'flex-start',
          }}
        >
          <Form.Item name="view" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>
              <span style={{ fontSize: '14px' }}>
                {' '}
                <EyeOutlined /> {t(LOCALE_KEYS.ALLOW_VIEW)}
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item name="insert" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>
              <span style={{ fontSize: '14px' }}>
                {' '}
                <PlusOutlined /> {t(LOCALE_KEYS.ALLOW_INSERT)}
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item name="update" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>
              <span style={{ fontSize: '14px' }}>
                {' '}
                <EditOutlined /> {t(LOCALE_KEYS.ALLOW_UPDATE)}
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item name="delete" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>
              <span style={{ fontSize: '14px' }}>
                {' '}
                <DeleteOutlined /> {t(LOCALE_KEYS.ALLOW_DELETE)}
              </span>
            </Checkbox>
          </Form.Item>
        </div>
      </div>

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
}

export default RoleMenuPermissionFormSingle;
