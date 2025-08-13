'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useRoles} from '@/hooks/useRoles';

import RoleForm from './RoleForm';


interface RoleFormDrawerProps {
  mode: 'create' | 'edit';
  roleId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const RoleFormDrawer: React.FC<RoleFormDrawerProps> = ({
  mode,
  roleId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getRoleById, selectedRole } = useRoles();
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });
  useEffect(() => {
    if (visible && mode === 'edit' && roleId) {
      getRoleById(roleId);
    }
  }, [visible, mode, roleId, getRoleById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={roleId} // Force remount when roleId changes
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
      <RoleForm
        mode={mode}
        roleId={roleId}
        initialValues={selectedRole || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default RoleFormDrawer;
