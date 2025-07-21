'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {PageHeader} from '@/components/ui/PageHeader';
import BranchForm from '@/components/branches/BranchForm';
import {useTranslations} from 'next-intl';

export default function CreateBranchPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('branch', { defaultValue: 'Branch' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader
            title={t('create_name', { name: entityName })}
            onBack={() => router.back()}
          />
          <BranchForm mode="create" />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
