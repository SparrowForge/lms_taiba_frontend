'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';
import UserRoleForm from '@/components/userRoles/UserRoleForm';

import {useLocalization} from '@/hooks/useLocalization';
import {useUserRoles} from '@/hooks/useUserRoles';

import {IUserRole} from '@/types/userRole';


interface UserRoleEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UserRoleEditPage: React.FC<UserRoleEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { selectedUserRole, loadUserRole } = useUserRoles();
  const [initialValues, setInitialValues] = useState<Partial<IUserRole> | undefined>();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE, { defaultValue: 'User Role' });
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const userRoleId = parseInt(resolvedParams.id);
    loadUserRole(userRoleId);
  }, [resolvedParams.id, loadUserRole]);

  useEffect(() => {
    if (selectedUserRole && selectedUserRole.id === parseInt(resolvedParams.id)) {
      setInitialValues({
        userId: selectedUserRole.userId,
        roleId: selectedUserRole.roleId,
      });
    }
  }, [selectedUserRole, resolvedParams.id]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={handleBack} />
        <UserRoleForm
          mode="edit"
          userRoleId={parseInt(resolvedParams.id)}
          initialValues={initialValues}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserRoleEditPage;
