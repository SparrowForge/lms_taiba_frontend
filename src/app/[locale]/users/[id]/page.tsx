'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useCreateUserDetailsConfig} from '@/components/users/userConfig';

import {useLocalization} from '@/hooks/useLocalization';
import {useUsers} from '@/hooks/useUsers';

import {IUser} from '@/types/user';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedUser, detailsStatus, loadUser } = useUsers();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER, { defaultValue: 'User' });

  const resolvedParams = React.use(params);
  const userId = parseInt(resolvedParams.id);

  // Load user if not already loaded
  useEffect(() => {
    //getUserById(userId);
    loadUser(userId);
  }, [loadUser, userId]);

  const config = useCreateUserDetailsConfig(
    selectedUser,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
