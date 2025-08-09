'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateRoleMenuPermissionDetailsConfig} from '@/components/roleMenuPermissions/roleMenuPermissionConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';

interface RoleMenuPermissionDetailPageProps {
  params: Promise<{ roleId: string; menuId: string; locale: string }>;
}

const RoleMenuPermissionDetailPage: React.FC<RoleMenuPermissionDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const {
    roleMenuPermissions,
    listStatus,
    loadRoleMenuPermissions,
    getRoleMenuPermissionById,
    loadRoleMenuPermission,
  } = useRoleMenuPermissions();
  const [permission, setPermission] = useState<IRoleMenuPermission | null>(null);
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });

  useEffect(() => {
    const roleId = parseInt(resolvedParams.roleId);
    const menuId = parseInt(resolvedParams.menuId);
    const foundPermission = getRoleMenuPermissionById(roleId, menuId);
    if (foundPermission) {
      setPermission(foundPermission);
    } else {
      loadRoleMenuPermission(roleId, menuId);
    }
  }, [
    resolvedParams.roleId,
    resolvedParams.menuId,
    getRoleMenuPermissionById,
    loadRoleMenuPermission,
  ]);

  useEffect(() => {
    if (roleMenuPermissions.length === 0) {
      loadRoleMenuPermissions();
    }
  }, [roleMenuPermissions.length, loadRoleMenuPermissions]);

  useEffect(() => {
    if (roleMenuPermissions.length > 0) {
      const roleId = parseInt(resolvedParams.roleId);
      const menuId = parseInt(resolvedParams.menuId);
      const foundPermission = getRoleMenuPermissionById(roleId, menuId);
      if (foundPermission) {
        setPermission(foundPermission);
      }
    }
  }, [
    roleMenuPermissions,
    resolvedParams.roleId,
    resolvedParams.menuId,
    getRoleMenuPermissionById,
  ]);

  const config = useCreateRoleMenuPermissionDetailsConfig(
    permission,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IRoleMenuPermission>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleMenuPermissionDetailPage;
