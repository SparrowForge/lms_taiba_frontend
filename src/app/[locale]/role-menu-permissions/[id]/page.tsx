'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateRoleMenuPermissionDetailsConfig} from '@/components/roleMenuPermissions/roleMenuPermissionConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';

export default function RoleMenuPermissionDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedRoleMenuPermission, detailsStatus, loadRoleMenuPermission } = useRoleMenuPermissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });

  const resolvedParams = React.use(params);
  const roleMenuPermissionId = parseInt(resolvedParams.id);

  // Load role menu permission if not already loaded
  useEffect(() => {
    //getRoleMenuPermissionById(roleMenuPermissionId);
    loadRoleMenuPermission(roleMenuPermissionId);
  }, [loadRoleMenuPermission, roleMenuPermissionId]);

  const config = useCreateRoleMenuPermissionDetailsConfig(
    selectedRoleMenuPermission,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
