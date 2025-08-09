'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import InstituteForm from '@/components/institutes/InstituteForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateInstitutePage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('institute', { defaultValue: 'Institute' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <InstituteForm mode="create" />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
