'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleForm from '@/components/roles/RoleForm';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateRolePage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('role', { defaultValue: 'Role' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <RoleForm mode="create" embedded={false} />
      </MainLayout>
    </ProtectedRoute>
  );
}
