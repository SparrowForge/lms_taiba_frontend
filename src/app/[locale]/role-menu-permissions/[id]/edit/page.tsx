'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleMenuPermissionForm from '@/components/roleMenuPermissions/RoleMenuPermissionForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermissionUpdate} from '@/types/roleMenuPermission';


const RoleMenuPermissionEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedRoleMenuPermission, detailsStatus, getRoleMenuPermissionById } = useRoleMenuPermissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });

  const id = parseInt(resolvedParams.id);

  useEffect(() => {
    getRoleMenuPermissionById(id);
  }, [getRoleMenuPermissionById, id]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedRoleMenuPermission || selectedRoleMenuPermission.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/role-menu-permissions" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <RoleMenuPermissionForm
            mode="edit"
            roleMenuPermissionId={selectedRoleMenuPermission.id}
            initialValues={selectedRoleMenuPermission as IRoleMenuPermissionUpdate}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleMenuPermissionEditPage;
