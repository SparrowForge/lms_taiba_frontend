'use client';

import { Drawer, Grid } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';
import { useUsers } from '@/hooks/useUsers';

import UserForm from './UserForm';

const { useBreakpoint } = Grid;

interface UserFormDrawerProps {
  mode: 'create' | 'edit';
  userId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserFormDrawer: React.FC<UserFormDrawerProps> = ({
  mode,
  userId,
  visible,
  onCancel,
  onSuccess,
}) => {

  const { getUserById, selectedUser } = useUsers();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER, { defaultValue: 'User' });
  useEffect(() => {
    if (visible && mode === 'edit' && userId) {
      getUserById(userId);
    }
  }, [visible, mode, userId, getUserById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };
  const screens = useBreakpoint();

  const getDrawerWidth = () => {
    if (screens.xl) return 500; // large desktops
    if (screens.lg) return 450; // tablets / laptops
    if (screens.md) return 400; // small laptops
    if (screens.sm) return "100%"; // mobile
    return "100%";
  };
  return (
    <Drawer
      key={userId} // Force remount when userId changes
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
       width={getDrawerWidth()}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <UserForm
        mode={mode}
        userId={userId}
        initialValues={selectedUser || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default UserFormDrawer;
