'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BranchForm from '@/components/branches/BranchForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateBranchPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('branch', { defaultValue: 'Branch' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <BranchForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
