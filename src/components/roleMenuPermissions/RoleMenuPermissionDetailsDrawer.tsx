import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';

import {useCreateRoleMenuPermissionDetailsConfig} from './roleMenuPermissionConfig';


interface RoleMenuPermissionDetailsDrawerProps {
  roleId?: number;
  menuId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit?: (roleId: number, menuId: number) => void;
}

const RoleMenuPermissionDetailsDrawer: React.FC<RoleMenuPermissionDetailsDrawerProps> = ({
  roleId,
  menuId,
  visible,
  onClose,
  onEdit,
}) => {
  const {
    roleMenuPermissions,
    listStatus,
    loadRoleMenuPermissions,
    getRoleMenuPermissionById,
    loadRoleMenuPermission,
  } = useRoleMenuPermissions();
  const [permission, setPermission] = useState<IRoleMenuPermission | null>(null);
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });

  useEffect(() => {
    if (roleId && menuId && visible) {
      const foundPermission = getRoleMenuPermissionById(roleId, menuId);
      if (foundPermission) {
        setPermission(foundPermission);
      } else {
        loadRoleMenuPermission(roleId, menuId);
      }
    }
  }, [roleId, menuId, visible, getRoleMenuPermissionById, loadRoleMenuPermission]);

  useEffect(() => {
    if (roleMenuPermissions.length === 0) {
      loadRoleMenuPermissions();
    }
  }, [roleMenuPermissions.length, loadRoleMenuPermissions]);

  useEffect(() => {
    if (roleMenuPermissions.length > 0 && roleId && menuId) {
      const foundPermission = getRoleMenuPermissionById(roleId, menuId);
      if (foundPermission) {
        setPermission(foundPermission);
      }
    }
  }, [roleMenuPermissions, roleId, menuId, getRoleMenuPermissionById]);

  const config = useCreateRoleMenuPermissionDetailsConfig(
    permission,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null,
    { embedded: true, onEdit: onEdit ? (p) => onEdit(p.roleId, p.menuId) : undefined },
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      open={visible}
      onClose={onClose}
      width={500}
      placement="right"
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default RoleMenuPermissionDetailsDrawer;
