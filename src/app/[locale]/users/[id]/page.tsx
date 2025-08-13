'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useCreateUserDetailsConfig} from '@/components/users/userConfig';

import {useUsers} from '@/hooks/useUsers';

import {Status} from '@/types/common';
import {IUser} from '@/types/user';

export default function UserDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedUser, detailsStatus, getUserById } = useUsers();
  const t = useTranslations();
  const entityName = t('user');

  const resolvedParams = React.use(params);
  const userId = parseInt(resolvedParams.id);

  // Load user if not already loaded
  useEffect(() => {
    getUserById(userId);
  }, [getUserById, userId]);

  const config = useCreateUserDetailsConfig(
    selectedUser,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IUser>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
