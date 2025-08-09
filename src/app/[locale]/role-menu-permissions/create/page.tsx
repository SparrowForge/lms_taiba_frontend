'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleMenuPermissionForm from '@/components/roleMenuPermissions/RoleMenuPermissionForm';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateRoleMenuPermissionPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <RoleMenuPermissionForm mode="create" embedded={false} />
      </MainLayout>
    </ProtectedRoute>
  );
}
