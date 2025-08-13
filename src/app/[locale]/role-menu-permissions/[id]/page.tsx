'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateRoleMenuPermissionDetailsConfig} from '@/components/roleMenuPermissions/roleMenuPermissionConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';

export default function RoleMenuPermissionDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedRoleMenuPermission, detailsStatus, getRoleMenuPermissionById } = useRoleMenuPermissions();
  const t = useTranslations();
  const entityName = t('roleMenuPermission');

  const resolvedParams = React.use(params);
  const roleMenuPermissionId = parseInt(resolvedParams.id);

  // Load role menu permission if not already loaded
  useEffect(() => {
    getRoleMenuPermissionById(roleMenuPermissionId);
  }, [getRoleMenuPermissionById, roleMenuPermissionId]);

  const config = useCreateRoleMenuPermissionDetailsConfig(
    selectedRoleMenuPermission,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IRoleMenuPermission>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
