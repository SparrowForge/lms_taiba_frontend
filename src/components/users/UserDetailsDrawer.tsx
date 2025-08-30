'use client';

import {Drawer, Grid} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
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

const { useBreakpoint } = Grid;
const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  userId,
  visible,
  onClose,
  onEdit,
}) => {

  const { selectedUser, getUserById, detailsStatus } = useUsers();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER, { defaultValue: 'User' });
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

    const screens = useBreakpoint();

  // Decide width based on breakpoint
  const getDrawerWidth = () => {
    if (screens.xl) return 500; // large desktops
    if (screens.lg) return 450; // tablets / laptops
    if (screens.md) return 500; // small laptops
    if (screens.sm) return "100%"; // mobile
    return "100%";
  };

  return (
    <Drawer
      key={userId} // Force remount when userId changes
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
      width={getDrawerWidth()}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default UserDetailsDrawer;
