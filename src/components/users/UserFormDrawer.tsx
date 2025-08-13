'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useUsers} from '@/hooks/useUsers';

import UserForm from './UserForm';


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
  const t = useTranslations();
  const entityName = t('user', { defaultValue: 'User' });
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

  return (
    <Drawer
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
