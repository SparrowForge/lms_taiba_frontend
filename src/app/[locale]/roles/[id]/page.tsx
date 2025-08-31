'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateRoleDetailsConfig} from '@/components/roles/roleConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {IRole} from '@/types/role';

export default function RoleDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedRole, detailsStatus, loadRole } = useRoles();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE, { defaultValue: 'Role' });

  const resolvedParams = React.use(params);
  const roleId = parseInt(resolvedParams.id);

  // Load role if not already loaded
  useEffect(() => {
    //getRoleById(roleId);
    loadRole(roleId);
  }, [loadRole, roleId]);

  const config = useCreateRoleDetailsConfig(
    selectedRole,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IRole>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
