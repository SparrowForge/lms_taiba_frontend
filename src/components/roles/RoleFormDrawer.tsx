'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE, { defaultValue: 'Role' });
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
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
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
