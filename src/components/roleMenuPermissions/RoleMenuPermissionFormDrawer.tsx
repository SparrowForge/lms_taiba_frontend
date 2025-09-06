'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';


import RoleMenuPermissionFormSingle from './RoleMenuPermissionFormSingle';

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
  const {
    getRoleMenuPermissionById,
    selectedRoleMenuPermission,
    loadRoleMenuPermission,
    detailsStatus,
  } = useRoleMenuPermissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });
  useEffect(() => {
    if (visible && mode === 'edit' && roleMenuPermissionId) {
      //getRoleMenuPermissionById(roleMenuPermissionId);
      loadRoleMenuPermission(roleMenuPermissionId);
    }
  }, [visible, mode, roleMenuPermissionId, loadRoleMenuPermission]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

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
      <RoleMenuPermissionFormSingle
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
