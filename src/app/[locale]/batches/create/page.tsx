'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BatchForm from '@/components/batches/BatchForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


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
