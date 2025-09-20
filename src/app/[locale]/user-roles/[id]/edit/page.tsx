'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';
import UserRoleForm from '@/components/userRoles/UserRoleFormSingle';

import {useLocalization} from '@/hooks/useLocalization';
import {useUserRoles} from '@/hooks/useUserRoles';

const UserRoleEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedUserRole, detailsStatus, loadUserRole } = useUserRoles();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE, { defaultValue: 'User Role' });

  const userRoleId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getUserRoleById(userRoleId);
    loadUserRole(userRoleId);
  }, [userRoleId, loadUserRole]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedUserRole || selectedUserRole.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/user-roles" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <UserRoleForm
          mode="edit"
          userRoleId={parseInt(resolvedParams.id)}
          initialValues={selectedUserRole}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserRoleEditPage;
