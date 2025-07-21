'use client';

import React, {useEffect, useState} from 'react';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';
import {createRoleMenuPermissionDetailsConfig} from '@/components/roleMenuPermissions/roleMenuPermissionConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';

interface RoleMenuPermissionDetailPageProps {
  params: Promise<{ roleId: string; menuId: string; locale: string }>;
}

const RoleMenuPermissionDetailPage: React.FC<RoleMenuPermissionDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { roleMenuPermissions, listStatus, loadRoleMenuPermissions, getRoleMenuPermissionById, loadRoleMenuPermission } = useRoleMenuPermissions();
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
  }, [resolvedParams.roleId, resolvedParams.menuId, getRoleMenuPermissionById, loadRoleMenuPermission]);

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
  }, [roleMenuPermissions, resolvedParams.roleId, resolvedParams.menuId, getRoleMenuPermissionById]);

  const config = createRoleMenuPermissionDetailsConfig(
    permission,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || t('failed_name', { name: entityName }) : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleMenuPermissionDetailPage;
