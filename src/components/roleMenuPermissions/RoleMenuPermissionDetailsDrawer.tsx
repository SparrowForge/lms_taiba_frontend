'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';

import {useCreateRoleMenuPermissionDetailsConfig} from './roleMenuPermissionConfig';


interface RoleMenuPermissionDetailsDrawerProps {
  id?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (roleMenuPermissionId: number) => void;
}

const RoleMenuPermissionDetailsDrawer: React.FC<RoleMenuPermissionDetailsDrawerProps> = ({
  id,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedRoleMenuPermission, getRoleMenuPermissionById, detailsStatus } = useRoleMenuPermissions();
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });
  useEffect(() => {
    if (visible && id) {
      getRoleMenuPermissionById(id);
    }
  }, [visible, id, getRoleMenuPermissionById]);

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
      title={t('details_name', { name: entityName })}
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
