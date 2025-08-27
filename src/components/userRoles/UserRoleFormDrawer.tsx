import {Drawer} from 'antd';
import React, {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useUserRoles} from '@/hooks/useUserRoles';

import {IUserRole} from '@/types/userRole';

import UserRoleFormSingle from './UserRoleFormSingle';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE, { defaultValue: 'User Role' });

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
      return t(LOCALE_KEYS.CREATE_NAME, { name: entityName });
    }
    return t(LOCALE_KEYS.EDIT_NAME, { name: entityName });
  };

  return (
    <Drawer
      title={getTitle()}
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <UserRoleFormSingle
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
