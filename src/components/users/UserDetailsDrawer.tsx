'use client';

import React, {useEffect, useState} from 'react';
import {Button, Drawer, Space} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import {useUsers} from '@/hooks/useUsers';
import {IUser} from '@/types/user';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';
import {createUserDetailsConfig} from '@/components/users/userConfig';
import { Status } from '@/types/common';
import { useTranslations } from 'next-intl';

interface UserDetailsDrawerProps {
  userId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit?: (userId: number) => void;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  userId,
  visible,
  onClose,
  onEdit
}) => {
  const { users, listStatus, getUserById, loadUser } = useUsers();
  const [user, setUser] = useState<IUser | null>(null);
  const t = useTranslations();
  const entityName = t('user', { defaultValue: 'User' }); 
  // Load user data when drawer opens
  useEffect(() => {
    if (userId && visible) {
      const foundUser = getUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        // Load user individually if not in list
        loadUser(userId);
      }
    }
  }, [userId, visible, getUserById, loadUser]);

  // Update user when loaded individually
  useEffect(() => {
    if (users.length > 0 && userId) {
      const foundUser = getUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [users, userId, getUserById]);

  const handleEdit = (user: IUser) => {
    if (onEdit) {
      onEdit(user.id);
    }
  };

  const config = createUserDetailsConfig(
    user,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null,
    {
      embedded: true,
      onEdit: onEdit ? handleEdit : undefined,
    }
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      open={visible}
      onClose={onClose}
      width={600}
      destroyOnHidden
      placement="right"
      extra={
        onEdit && user ? (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(user.id)}
            >
              {t('edit_name', { name: entityName })}
            </Button>
          </Space>
        ) : undefined
      }
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default UserDetailsDrawer;
