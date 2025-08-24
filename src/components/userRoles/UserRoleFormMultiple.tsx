'use client';

import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import {Button, Form, Select, Space, Alert, Modal} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';
import {useUserRoles} from '@/hooks/useUserRoles';
import {useUsers} from '@/hooks/useUsers';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IUserRoleCreate, IUserRoleUpdate, IUserRoleBulkCreate} from '@/types/userRole';


interface UserRoleFormProps {
  mode: 'create' | 'edit';
  userRoleId?: number;
  initialValues?: Partial<IUserRoleCreate | IUserRoleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

function UserRoleFormMultiple({
  userRoleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}: UserRoleFormProps) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE);
  const router = useRouter();
 const [multipleForm] = Form.useForm();
  const [localSelectedRoles, setLocalSelectedRoles] = useState<number[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const [showUpdateWarning, setShowUpdateWarning] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<IUserRoleBulkCreate | null>(null);

  const { createUserRolesBulk, actionStatus, userRoles, loadUserRoles } = useUserRoles();
  const { users, loadUsers } = useUsers();
  const { rolesWithPermissions, rolesWithPermissionsStatus, loadRolesWithPermissions } = useRoleMenuPermissions();

  useEffect(() => {
    loadUsers({ page: 1, limit: 100 });
    loadRolesWithPermissions();
  }, [loadUsers, loadRolesWithPermissions]);

  useEffect(() => {
    multipleForm.resetFields();
      setLocalSelectedRoles([]);
      setSelectedUserId(undefined);
      setShowUpdateWarning(false);
  }, [multipleForm]);

  // Load existing user roles when user is selected
  useEffect(() => {
    if (selectedUserId) {
      loadUserRoles({ userId: selectedUserId })
    }
  }, [selectedUserId, loadUserRoles]);

  useEffect(() => {
    if (userRoles.length > 0 && selectedUserId) {
      setLocalSelectedRoles(userRoles.map(ur => ur.roleId));
    }
  }, [selectedUserId, userRoles]);

  const handleMultipleSubmit = async () => {
    try {
      console.log('=== MULTIPLE ROLES SUBMISSION START ===');

      // Get selected user from form and roles from local state
      const selectedUserId = multipleForm.getFieldValue('userId');
      const selectedRoleIds = localSelectedRoles;

      console.log('Selected user ID:', selectedUserId);
      console.log('Selected role IDs:', selectedRoleIds);

      const submitData = {
        userId: selectedUserId,
        roleIds: selectedRoleIds || []
      };

      // Validate userId (form validation should handle this, but double-check)
      if (!submitData.userId) {
        toast.error(t(LOCALE_KEYS.PLEASE_SELECT_USER));
        return;
      }

      // Validate that at least one role is selected
      if (!submitData.roleIds || submitData.roleIds.length === 0) {
        toast.error('Please select at least one role to assign to the user');
        return;
      }

      // Check if this is an update operation (user already has roles)
      const existingUserRoles = userRoles.filter(ur => ur.userId === selectedUserId);

      if (existingUserRoles.length > 0) {
        // Show warning and confirmation for update
        setPendingSubmitData(submitData);
        setShowUpdateWarning(true);
        return;
      }

      // Proceed with submission (create mode or no existing roles)
      await submitUserRoles(submitData);

    } catch (error: unknown) {
      console.error('Multiple roles submission error:', error);
      toast.error(getErrorMessage(error));
    }
  };

  const submitUserRoles = async (submitData: IUserRoleBulkCreate) => {
    try {
      await createUserRolesBulk(submitData);

      toast.success(`Successfully updated user roles`);

      if (onSuccess) {
        onSuccess();
      } else if (!embedded) {
        router.push('/user-roles');
      }
    } catch (error: unknown) {
      console.error('Submit user roles error:', error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateConfirmation = async () => {
    if (pendingSubmitData) {
      setShowUpdateWarning(false);
      setPendingSubmitData(null);
      await submitUserRoles(pendingSubmitData);
    }
  };

  const handleUpdateCancel = () => {
    setShowUpdateWarning(false);
    setPendingSubmitData(null);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const getSubmitText = () => {
    if (actionStatus.status === Status.LOADING) {
      return t(LOCALE_KEYS.LOADING);
    }
    return t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });
  };

  const handleRoleSelection = (roleId: number, checked: boolean) => {
    if (checked) {
      setLocalSelectedRoles(prev => [...prev, roleId]);
    } else {
      setLocalSelectedRoles(prev => prev.filter(id => id !== roleId));
    }
  };

  const renderMultipleRoleForm = () => (
    <Form
      form={multipleForm}
      layout="vertical"
      initialValues={{ userId: undefined }}
      disabled={actionStatus.status === Status.LOADING}
    >
      {/* User Selection and Submit Button - Same Row */}
      <div style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end',
        marginBottom: '24px'
      }}>
        <div style={{ flex: '1' }}>
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
              onChange={(value) => {
                console.log('User selected:', value);
                setSelectedUserId(value);
                // Reset selected roles when user changes
                setLocalSelectedRoles([]);
              }}
              style={{ width: '100%' }}
            >
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {`${user.firstName} ${user.lastName} (${user.email})`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              onClick={handleMultipleSubmit}
              loading={actionStatus.status === Status.LOADING}
              size="large"
            >
              {getSubmitText()}
            </Button>
            <Button
              onClick={handleCancel}
              size="large"
            >
              {t(LOCALE_KEYS.CANCEL)}
            </Button>
          </Space>
        </Form.Item>
      </div>

      {/* Update Warning Alert */}
      {selectedUserId && userRoles.filter(ur => ur.userId === selectedUserId).length > 0 && (
        <Alert
          message="⚠️ Update Warning"
          description="This user already has assigned roles. Updating will replace all existing roles with your new selection."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Role Selection */}
      <div style={{
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        padding: '16px',
        overflowY: 'auto',
        maxHeight: '50vh',
        marginBottom: '16px'
      }}>
        {rolesWithPermissionsStatus.status === Status.LOADING ? (
          <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
            Loading roles with permissions...
          </div>
        ) : rolesWithPermissions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
            No roles with permissions found
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'flex-start'
          }}>
            {rolesWithPermissions.map((role) => (
              <div key={role.id} style={{
                border: localSelectedRoles.includes(role.id)
                  ? '2px solid #1890ff'
                  : '1px solid #e8e8e8',
                borderRadius: '6px',
                padding: '12px',
                minWidth: '300px',
                flex: '1 1 300px',
                maxWidth: '400px'
              }}>
                {/* Role Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <div className='flex flex-col'>
                  <div className='flex flex-row'>
                  <input
                    type="checkbox"
                    style={{ marginRight: 12 }}
                    checked={localSelectedRoles.includes(role.id)}
                    onChange={(e) => handleRoleSelection(role.id, e.target.checked)}
                  />
                   <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    {role.name}
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '12px',
                      color: '#8c8c8c',
                      fontWeight: 'normal'
                    }}>
                      ({role.menuPermissions?.length || 0} permissions)
                    </span>
                  </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#8c8c8c', fontStyle: 'italic' }}>
                    {role.description}
                  </div>

                  </div>
                </div>

                {/* Menus and Permissions under this role */}
                {role.menuPermissions && role.menuPermissions.length > 0 ? (
                  <div style={{ marginLeft: '12px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#8c8c8c',
                      marginBottom: '8px',
                      fontStyle: 'italic'
                    }}>
                      Menu permissions (read-only):
                    </div>
                    {role.menuPermissions.map((permission) => (
                      <div key={permission.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '8px 0',
                        marginLeft: '8px',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>
                          {permission.menu?.name || 'Unknown Menu'}
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '12px',
                            color: '#8c8c8c'
                          }}>
                            ({permission.menu?.panel?.name || 'Unknown Panel'})
                          </span>
                        </div>

                        {/* Permission Indicators */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginLeft: '16px',
                          marginTop: '4px'
                        }}>
                          {permission.view && (
                            <span style={{
                              fontSize: '11px',
                              color: '#52c41a',
                              backgroundColor: '#f6ffed',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              border: '1px solid #b7eb8f'
                            }}>
                               <EyeOutlined/> View
                            </span>
                          )}
                          {permission.insert && (
                            <span style={{
                              fontSize: '11px',
                              color: '#1890ff',
                              backgroundColor: '#e6f7ff',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              border: '1px solid #91d5ff'
                            }}>
                               <PlusOutlined/> Insert
                            </span>
                          )}
                          {permission.update && (
                            <span style={{
                              fontSize: '11px',
                              color: '#fa8c16',
                              backgroundColor: '#fff7e6',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              border: '1px solid #ffd591'
                            }}>
                               <EditOutlined/> Update
                            </span>
                          )}
                          {permission.delete && (
                            <span style={{
                              fontSize: '11px',
                              color: '#ff4d4f',
                              backgroundColor: '#fff2f0',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              border: '1px solid #ffccc7'
                            }}>
                               <DeleteOutlined/> Delete
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    marginLeft: '24px',
                    fontSize: '12px',
                    color: '#bfbfbf',
                    fontStyle: 'italic'
                  }}>
                    No menu permissions for this role
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Roles Display */}
      <div style={{
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        padding: '16px',
        // backgroundColor: '#fafafa',
        minHeight: '60px'
      }}>
        {(!Array.isArray(localSelectedRoles) || localSelectedRoles.length === 0) ? (
          <div style={{ fontSize: '12px', color: '#8c8c8c', fontStyle: 'italic' }}>
            No roles selected
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              {localSelectedRoles.length} role(s) selected:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {localSelectedRoles.map((roleId: number) => {
                const role = rolesWithPermissions.find(r => r.id === roleId);

                if (!role) return null;

                return (
                  <div
                    key={roleId}
                    style={{
                      backgroundColor: '#e6f7ff',
                      border: '1px solid #91d5ff',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      color: '#1890ff'
                    }}
                  >
                    {role.name} ({role.menuPermissions?.length || 0} permissions)
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Form>
  );

  return (
    <>
      {renderMultipleRoleForm()}

      {/* Update Confirmation Modal */}
      <Modal
        title="⚠️ Confirm Role Update"
        open={showUpdateWarning}
        onOk={handleUpdateConfirmation}
        onCancel={handleUpdateCancel}
        okText="Yes, Update Roles"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          This user currently has <strong>{userRoles.filter(ur => ur.userId === selectedUserId).length}</strong> assigned roles.
        </p>
        <p>
          Updating will <strong>replace all existing roles</strong> with your new selection of <strong>{localSelectedRoles.length}</strong> roles.
        </p>
        <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          This action cannot be undone. Are you sure you want to proceed?
        </p>
      </Modal>
    </>
  );
}

export default UserRoleFormMultiple;
