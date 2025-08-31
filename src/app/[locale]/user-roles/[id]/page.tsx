'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useCreateUserRoleDetailsConfig} from '@/components/userRoles/userRoleConfig';

import {useLocalization} from '@/hooks/useLocalization';
import {useUserRoles} from '@/hooks/useUserRoles';

import {Status} from '@/types/common';
import {IUserRole} from '@/types/userRole';

export default function UserRoleDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedUserRole, detailsStatus, loadUserRole } = useUserRoles();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE, { defaultValue: 'User Role' });

  const resolvedParams = React.use(params);
  const userRoleId = parseInt(resolvedParams.id);

  // Load user role if not already loaded
  useEffect(() => {
    //getUserRoleById(userRoleId);
    loadUserRole(userRoleId);
  }, [loadUserRole, userRoleId]);

  const config = useCreateUserRoleDetailsConfig(
    selectedUserRole,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IUserRole>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
