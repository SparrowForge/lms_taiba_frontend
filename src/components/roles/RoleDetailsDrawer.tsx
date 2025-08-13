'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE, { defaultValue: 'Role' });
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

export default RoleDetailsDrawer;
