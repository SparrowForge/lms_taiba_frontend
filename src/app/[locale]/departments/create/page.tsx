'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import DepartmentForm from '@/components/departments/DepartmentForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateDepartmentPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('department', { defaultValue: 'Department' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <DepartmentForm mode="create" embedded={false} />
      </MainLayout>
    </ProtectedRoute>
  );
}
