'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FeeStructureForm from '@/components/feeStructures/FeeStructureForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';

export default function CreateFeeStructurePage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })} onBack={() => router.back()} />
          <FeeStructureForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
