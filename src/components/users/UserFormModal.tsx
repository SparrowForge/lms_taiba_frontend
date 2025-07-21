'use client';

import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {useUsers} from '@/hooks/useUsers';
import {IUser, IUserCreate, IUserUpdate} from '@/types/user';
import UserForm from './UserForm';

interface UserFormDrawerProps {
  mode: 'create' | 'edit';
  userId?: number;
  initialValues?: Partial<IUserCreate | IUserUpdate>;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const UserFormDrawer: React.FC<UserFormDrawerProps> = ({
  mode,
  userId,
  initialValues,
  visible,
  onCancel,
  onSuccess
}) => {
  const { getUserById, loadUser } = useUsers();
  const [user, setUser] = useState<IUser | null>(null);

  // Load user data for edit mode
  useEffect(() => {
    if (mode === 'edit' && userId && visible) {
      const foundUser = getUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        // Load user individually if not in list
        loadUser(userId);
      }
    }
  }, [mode, userId, visible, getUserById, loadUser]);

  // Update user when loaded individually
  useEffect(() => {
    if (user && mode === 'edit') {
      // User data is now available for the form
    }
  }, [user, mode]);

  const getTitle = () => {
    return mode === 'create' ? 'Create User' : 'Edit User';
  };

  const handleDrawerSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onCancel();
  };

  const handleDrawerCancel = () => {
    onCancel();
  };

  // Prepare initial values for edit mode
  const getFormInitialValues = () => {
    if (mode === 'edit' && user) {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        status: user.status as "active" | "inactive" | "pending",
      };
    }
    return initialValues;
  };

  return (
    <Drawer
      title={getTitle()}
      open={visible}
      onClose={handleDrawerCancel}
      width={600}
      destroyOnHidden
      placement="right"
    >
      <UserForm
        mode={mode}
        userId={userId}
        initialValues={getFormInitialValues()}
        onSuccess={handleDrawerSuccess}
        onCancel={handleDrawerCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default UserFormDrawer;
