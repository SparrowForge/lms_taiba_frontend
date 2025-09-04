'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';

import {useCreateRoleMenuPermissionDetailsConfig} from './roleMenuPermissionConfig';

interface RoleMenuPermissionDetailsDrawerProps {
  roleMenuPermissionId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (roleMenuPermissionId: number) => void;
}

const RoleMenuPermissionDetailsDrawer: React.FC<RoleMenuPermissionDetailsDrawerProps> = ({
  roleMenuPermissionId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedRoleMenuPermission, loadRoleMenuPermission, detailsStatus } =
    useRoleMenuPermissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });
  useEffect(() => {
    if (visible && roleMenuPermissionId) {
      //getRoleMenuPermissionById(roleMenuPermissionId);
      loadRoleMenuPermission(roleMenuPermissionId);
    }
  }, [visible, roleMenuPermissionId, loadRoleMenuPermission]);

  const handleEdit = (roleMenuPermission: IRoleMenuPermission) => {
    onEdit(roleMenuPermission.id);
  };

  const config = useCreateRoleMenuPermissionDetailsConfig(
    selectedRoleMenuPermission,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={roleMenuPermissionId} // Force remount when roleMenuPermissionId changes
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default RoleMenuPermissionDetailsDrawer;
