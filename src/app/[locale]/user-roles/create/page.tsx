'use client';

import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import UserRoleForm from '@/components/userRoles/UserRoleForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const UserRoleCreatePage: React.FC = () => {
  const t = useTranslations();
  const entityName = t('userRole', { defaultValue: 'User Role' });
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t('create_name', { name: entityName })} onBack={handleBack} />
        <UserRoleForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserRoleCreatePage;
