'use client';

import React, {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {useCreateUserRoleDetailsConfig} from '@/components/userRoles/userRoleConfig';

import {useLocalization} from '@/hooks/useLocalization';
import {useUserRoles} from '@/hooks/useUserRoles';

import {Status} from '@/types/common';
import {IUserRole} from '@/types/userRole';

interface UserRoleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UserRoleDetailPage: React.FC<UserRoleDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { userRoles, listStatus, loadUserRoles, selectedUserRole, loadUserRole } = useUserRoles();
  const [userRole, setUserRole] = useState<IUserRole | null>(null);
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE, { defaultValue: 'User Role' });

  useEffect(() => {
    const userRoleId = parseInt(resolvedParams.id);
    const foundUserRole = userRoles.find((ur) => ur.id === userRoleId);
    if (foundUserRole) {
      setUserRole(foundUserRole);
    } else {
      loadUserRole(userRoleId);
    }
  }, [resolvedParams.id, userRoles, loadUserRole]);

  useEffect(() => {
    if (userRoles.length === 0) {
      loadUserRoles();
    }
  }, [userRoles.length, loadUserRoles]);

  useEffect(() => {
    if (selectedUserRole && selectedUserRole.id === parseInt(resolvedParams.id)) {
      setUserRole(selectedUserRole);
    }
  }, [selectedUserRole, resolvedParams.id]);

  const config = useCreateUserRoleDetailsConfig(
    userRole,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserRoleDetailPage;
