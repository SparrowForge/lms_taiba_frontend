'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';
import UserRoleFormTabView from '@/components/userRoles/UserRoleFormTabView';

import {useLocalization} from '@/hooks/useLocalization';

const UserRoleCreatePage: React.FC = () => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER_ROLE, { defaultValue: 'User Role' });
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })} onBack={handleBack} />
        <UserRoleFormTabView mode="create" embedded={false} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserRoleCreatePage;
