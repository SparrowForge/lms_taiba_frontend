'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BatchForm from '@/components/batches/BatchForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';


const BatchCreatePage: React.FC = () => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })} onBack={handleBack} />
          <BatchForm mode="create" onCancel={handleBack} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BatchCreatePage;
