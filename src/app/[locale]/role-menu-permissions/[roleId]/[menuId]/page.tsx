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
  params: Promise<{ roleId: string; menuId: string }> 
}) {
  const { selectedRoleMenuPermission, detailsStatus, getRoleMenuPermissionById } = useRoleMenuPermissions();
  const t = useTranslations();
  const entityName = t('roleMenuPermission');

  const resolvedParams = React.use(params);
  // For role menu permissions, we need to construct a unique ID from roleId and menuId
  // This assumes the API endpoint can handle this or we need to modify the hook
  const roleId = parseInt(resolvedParams.roleId);
  const menuId = parseInt(resolvedParams.menuId);

  // Load role menu permission if not already loaded
  useEffect(() => {
    // Note: This might need adjustment based on how the API identifies role menu permissions
    // For now, using a combination approach
    const combinedId = roleId * 10000 + menuId; // Simple way to create unique ID
    getRoleMenuPermissionById(combinedId);
  }, [getRoleMenuPermissionById, roleId, menuId]);

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
