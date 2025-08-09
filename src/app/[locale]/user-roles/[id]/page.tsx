'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {useCreateUserRoleDetailsConfig} from '@/components/userRoles/userRoleConfig';

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
  const t = useTranslations();
  const entityName = t('userRole');

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
      ? listStatus.message || t('failed_name', { name: entityName })
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
