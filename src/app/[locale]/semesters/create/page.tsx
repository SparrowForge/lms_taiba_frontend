'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SemesterForm from '@/components/semesters/SemesterForm';
import {PageHeader} from '@/components/ui/PageHeader';

const SemesterCreatePage: React.FC = () => {
  const t = useTranslations();
  const entityName = t('semester');
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={handleBack} />

          <SemesterForm mode="create" embedded={false} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterCreatePage;
