'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateRoleDetailsConfig} from '@/components/roles/roleConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {IRole} from '@/types/role';

export default function RoleDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedRole, detailsStatus, getRoleById } = useRoles();
  const t = useTranslations();
  const entityName = t('role');

  const resolvedParams = React.use(params);
  const roleId = parseInt(resolvedParams.id);

  // Load role if not already loaded
  useEffect(() => {
    getRoleById(roleId);
  }, [getRoleById, roleId]);

  const config = useCreateRoleDetailsConfig(
    selectedRole,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
