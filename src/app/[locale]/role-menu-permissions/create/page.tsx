'use client';

import React from 'react';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import RoleMenuPermissionForm from '@/components/roleMenuPermissions/RoleMenuPermissionForm';
import {useTranslations} from 'next-intl';
import {PageHeader} from '@/components/ui/PageHeader';
import {useRouter} from 'next/navigation';

export default function CreateRoleMenuPermissionPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader
            title={t('create_name', { name: entityName })}
            onBack={() => router.back()}
          />
          <RoleMenuPermissionForm
            mode="create"
            embedded={false}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
