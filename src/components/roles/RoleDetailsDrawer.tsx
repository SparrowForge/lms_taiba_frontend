import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {IRole} from '@/types/role';

import {useCreateRoleDetailsConfig} from './roleConfig';


interface RoleDetailsDrawerProps {
  roleId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit?: (roleId: number) => void;
}

const RoleDetailsDrawer: React.FC<RoleDetailsDrawerProps> = ({
  roleId,
  visible,
  onClose,
  onEdit,
}) => {
  const { roles, listStatus, loadRoles, getRoleById, loadRole } = useRoles();
  const [role, setRole] = useState<IRole | null>(null);
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });

  useEffect(() => {
    if (roleId && visible) {
      const foundRole = getRoleById(roleId);
      if (foundRole) {
        setRole(foundRole);
      } else {
        loadRole(roleId);
      }
    }
  }, [roleId, visible, getRoleById, loadRole]);

  useEffect(() => {
    if (roles.length === 0) {
      loadRoles();
    }
  }, [roles.length, loadRoles]);

  useEffect(() => {
    if (roles.length > 0 && roleId) {
      const foundRole = getRoleById(roleId);
      if (foundRole) {
        setRole(foundRole);
      }
    }
  }, [roles, roleId, getRoleById]);

  const config = useCreateRoleDetailsConfig(
    role,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null,
    { embedded: true, onEdit: onEdit ? (p) => onEdit(p.id) : undefined },
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

export default RoleDetailsDrawer;
