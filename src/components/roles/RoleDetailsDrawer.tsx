'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {IRole} from '@/types/role';

import {useCreateRoleDetailsConfig} from './roleConfig';


interface RoleDetailsDrawerProps {
  roleId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (roleId: number) => void;
}

const RoleDetailsDrawer: React.FC<RoleDetailsDrawerProps> = ({
  roleId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedRole, getRoleById, detailsStatus } = useRoles();
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });
  useEffect(() => {
    if (visible && roleId) {
      getRoleById(roleId);
    }
  }, [visible, roleId, getRoleById]);

  const handleEdit = (role: IRole) => {
    onEdit(role.id);
  };

  const config = useCreateRoleDetailsConfig(
    selectedRole,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={roleId} // Force remount when roleId changes
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

export default RoleDetailsDrawer;
