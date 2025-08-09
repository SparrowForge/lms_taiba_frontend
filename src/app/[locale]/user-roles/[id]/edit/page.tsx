'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import UserRoleForm from '@/components/userRoles/UserRoleForm';

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
  const t = useTranslations();
  const entityName = t('userRole', { defaultValue: 'User Role' });
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
        <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
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
