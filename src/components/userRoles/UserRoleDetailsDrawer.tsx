import {Drawer} from 'antd';
import React, {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useUserRoles} from '@/hooks/useUserRoles';

import {Status} from '@/types/common';
import {IUserRole} from '@/types/userRole';

import {useCreateUserRoleDetailsConfig} from './userRoleConfig';

interface UserRoleDetailsDrawerProps {
  userRoleId: number | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (userRoleId: number) => void;
}

const UserRoleDetailsDrawer: React.FC<UserRoleDetailsDrawerProps> = ({
  userRoleId,
  visible,
  onClose,
  onEdit,
}) => {
  const [userRole, setUserRole] = useState<IUserRole | null>(null);
  const { userRoles, selectedUserRole, loadUserRole, detailsStatus } = useUserRoles();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE, { defaultValue: 'User Role' });

  useEffect(() => {
    if (visible && userRoleId) {
      // Try to get from current list first
      const existingUserRole = userRoles.find((ur) => ur.id === userRoleId);
      if (existingUserRole) {
        setUserRole(existingUserRole);
      } else {
        // Load from API if not in current list
        loadUserRole(userRoleId);
      }
    } else {
      setUserRole(null);
    }
  }, [visible, userRoleId, userRoles, loadUserRole]);

  // Update user role when selectedUserRole changes
  useEffect(() => {
    if (selectedUserRole && selectedUserRole.id === userRoleId) {
      setUserRole(selectedUserRole);
    }
  }, [selectedUserRole, userRoleId]);

  const handleEdit = (userRole: IUserRole) => {
    onEdit(userRole.id);
  };

  const config = useCreateUserRoleDetailsConfig(
    userRole,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default UserRoleDetailsDrawer;
