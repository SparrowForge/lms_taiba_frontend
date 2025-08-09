import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {IRoleMenuPermission} from '@/types/roleMenuPermission';

import RoleMenuPermissionForm from './RoleMenuPermissionForm';


interface RoleMenuPermissionFormDrawerProps {
  mode: 'create' | 'edit';
  roleId?: number;
  menuId?: number;
  initialValues?: Partial<IRoleMenuPermission>;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const RoleMenuPermissionFormDrawer: React.FC<RoleMenuPermissionFormDrawerProps> = ({
  mode,
  roleId,
  menuId,
  initialValues,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getRoleMenuPermissionById, loadRoleMenuPermission } = useRoleMenuPermissions();
  const [permission, setPermission] = useState<IRoleMenuPermission | null>(null);
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });

  useEffect(() => {
    if (mode === 'edit' && roleId && menuId && visible) {
      const foundPermission = getRoleMenuPermissionById(roleId, menuId);
      if (foundPermission) {
        setPermission(foundPermission);
      } else {
        loadRoleMenuPermission(roleId, menuId);
      }
    }
  }, [mode, roleId, menuId, visible, getRoleMenuPermissionById, loadRoleMenuPermission]);

  const getTitle = () =>
    mode === 'create'
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  const getFormInitialValues = () => {
    if (mode === 'edit' && permission) {
      return {
        view: permission.view,
        insert: permission.insert,
        update: permission.update,
        delete: permission.delete,
      };
    }
    return initialValues;
  };

  return (
    <Drawer title={getTitle()} open={visible} onClose={onCancel} width={500} placement="right">
      <RoleMenuPermissionForm
        mode={mode}
        roleId={roleId}
        menuId={menuId}
        initialValues={getFormInitialValues()}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default RoleMenuPermissionFormDrawer;
