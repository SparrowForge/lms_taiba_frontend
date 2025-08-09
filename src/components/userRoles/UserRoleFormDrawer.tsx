import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useUserRoles} from '@/hooks/useUserRoles';

import {IUserRole} from '@/types/userRole';

import UserRoleForm from './UserRoleForm';

interface UserRoleFormDrawerProps {
  mode: 'create' | 'edit';
  userRoleId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserRoleFormDrawer: React.FC<UserRoleFormDrawerProps> = ({
  mode,
  userRoleId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<IUserRole> | undefined>();
  const { selectedUserRole, loadUserRole } = useUserRoles();
  const t = useTranslations();
  const entityName = t('userRole', { defaultValue: 'User Role' });

  useEffect(() => {
    if (visible && mode === 'edit' && userRoleId) {
      loadUserRole(userRoleId);
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, userRoleId, loadUserRole]);

  useEffect(() => {
    if (selectedUserRole && selectedUserRole.id === userRoleId) {
      setInitialValues({
        userId: selectedUserRole.userId,
        roleId: selectedUserRole.roleId,
      });
    }
  }, [selectedUserRole, userRoleId]);

  const handleSuccess = () => {
    onSuccess();
    setInitialValues(undefined);
  };

  const handleCancel = () => {
    onCancel();
    setInitialValues(undefined);
  };

  const getTitle = () => {
    if (mode === 'create') {
      return t('create_name', { name: entityName });
    }
    return t('edit_name', { name: entityName });
  };

  return (
    <Drawer
      title={getTitle()}
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <UserRoleForm
        mode={mode}
        userRoleId={userRoleId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default UserRoleFormDrawer;
