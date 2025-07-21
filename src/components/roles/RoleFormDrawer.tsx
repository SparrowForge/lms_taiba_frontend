import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {useRoles} from '@/hooks/useRoles';
import {IRole} from '@/types/role';
import RoleForm from './RoleForm';
import {useTranslations} from 'next-intl';

interface RoleFormDrawerProps {
  mode: 'create' | 'edit';
  roleId?: number;
  initialValues?: Partial<IRole>;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const RoleFormDrawer: React.FC<RoleFormDrawerProps> = ({
  mode,
  roleId,
  initialValues,
  visible,
  onCancel,
  onSuccess
}) => {
  const { getRoleById, loadRole } = useRoles();
  const [role, setRole] = useState<IRole | null>(null);
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });

  useEffect(() => {
    if (mode === 'edit' && roleId && visible) {
      const foundRole = getRoleById(roleId);
      if (foundRole) {
        setRole(foundRole);
      } else {
        loadRole(roleId);
      }
    }
  }, [mode, roleId, visible, getRoleById, loadRole]);

  const getTitle = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  const getFormInitialValues = () => {
    if (mode === 'edit' && role) {
      return {
        branchId: role.branchId,
        name: role.name,
        description: role.description,
      };
    }
    return initialValues;
  };

  return (
    <Drawer
      title={getTitle()}
      open={visible}
      onClose={onCancel}
      width={500}
      placement="right"
    >
      <RoleForm
        mode={mode}
        roleId={roleId}
        initialValues={getFormInitialValues()}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default RoleFormDrawer;
