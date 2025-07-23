'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {PageHeader} from '@/components/ui/PageHeader';
import BatchForm from '@/components/batches/BatchForm';
import {useTranslations} from 'next-intl';

const BatchCreatePage: React.FC = () => {
  const t = useTranslations();
  const entityName = t('batch');
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={handleBack} />
          <BatchForm mode="create" onCancel={handleBack} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BatchCreatePage;
