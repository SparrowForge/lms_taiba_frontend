'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import RoleMenuPermissionForm from './RoleMenuPermissionForm';


interface RoleMenuPermissionFormDrawerProps {
  mode: 'create' | 'edit';
  roleMenuPermissionId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const RoleMenuPermissionFormDrawer: React.FC<RoleMenuPermissionFormDrawerProps> = ({
  mode,
  roleMenuPermissionId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getRoleMenuPermissionById, selectedRoleMenuPermission } = useRoleMenuPermissions();
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });
  useEffect(() => {
    if (visible && mode === 'edit' && roleMenuPermissionId) {
      getRoleMenuPermissionById(roleMenuPermissionId);
    }
  }, [visible, mode, roleMenuPermissionId, getRoleMenuPermissionById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={roleMenuPermissionId} // Force remount when roleMenuPermissionId changes
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <RoleMenuPermissionForm
        mode={mode}
        roleMenuPermissionId={roleMenuPermissionId}
        initialValues={selectedRoleMenuPermission || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default RoleMenuPermissionFormDrawer;
