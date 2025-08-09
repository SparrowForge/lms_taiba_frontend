import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useRoles} from '@/hooks/useRoles';

import {IRole} from '@/types/role';

import RoleForm from './RoleForm';


interface RoleFormDrawerProps {
  mode: 'create' | 'edit';
  roleId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const RoleFormDrawer: React.FC<RoleFormDrawerProps> = ({
  mode,
  roleId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<IRole> | undefined>();
  const { getRoleById, loadRole } = useRoles();
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });

  useEffect(() => {
    if (mode === 'edit' && roleId && visible) {
      const foundRole = getRoleById(roleId);
      if (foundRole) {
        setInitialValues(foundRole);
      } else {
        loadRole(roleId);
      }
    }
  }, [mode, roleId, visible, getRoleById, loadRole]);

  const getTitle = () =>
    mode === 'create'
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  return (
    <Drawer title={getTitle()} open={visible} onClose={onCancel} width={500} placement="right">
      <RoleForm
        mode={mode}
        roleId={roleId}
        initialValues={initialValues}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default RoleFormDrawer;
