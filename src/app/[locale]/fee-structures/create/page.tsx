'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FeeStructureForm from '@/components/feeStructures/FeeStructureForm';
import {MainLayout} from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

export default function CreateFeeStructurePage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('feeStructure', { defaultValue: 'Fee Structure' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <FeeStructureForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
