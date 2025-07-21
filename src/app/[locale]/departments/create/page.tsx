'use client';

import React from 'react';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import DepartmentForm from '@/components/departments/DepartmentForm';
import {useTranslations} from 'next-intl';
import {PageHeader} from '@/components/ui/PageHeader';
import {useRouter} from 'next/navigation';

export default function CreateDepartmentPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('department', { defaultValue: 'Department' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader
            title={t('create_name', { name: entityName })}
            onBack={() => router.back()}
          />
          <DepartmentForm
            mode="create"
            embedded={false}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
