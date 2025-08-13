'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });
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
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
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
