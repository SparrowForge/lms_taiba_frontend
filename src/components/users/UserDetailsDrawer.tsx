'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useUsers} from '@/hooks/useUsers';

import {Status} from '@/types/common';
import {IUser} from '@/types/user';

import {useCreateUserDetailsConfig} from './userConfig';


interface UserDetailsDrawerProps {
  userId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (userId: number) => void;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  userId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedUser, getUserById, detailsStatus } = useUsers();
  const t = useTranslations();
  const entityName = t('user', { defaultValue: 'User' });
  useEffect(() => {
    if (visible && userId) {
      getUserById(userId);
    }
  }, [visible, userId, getUserById]);

  const handleEdit = (user: IUser) => {
    onEdit(user.id);
  };

  const config = useCreateUserDetailsConfig(
    selectedUser,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default UserDetailsDrawer;
