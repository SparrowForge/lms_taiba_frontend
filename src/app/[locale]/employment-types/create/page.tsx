'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import EmploymentTypeForm from '@/components/employmentTypes/EmploymentTypeForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateEmploymentTypePage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('employmentType', { defaultValue: 'Employment Type' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <EmploymentTypeForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
