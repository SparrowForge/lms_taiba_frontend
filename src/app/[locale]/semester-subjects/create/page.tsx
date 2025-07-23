'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {PageHeader} from '@/components/ui/PageHeader';
import SemesterSubjectForm from '@/components/semesterSubjects/SemesterSubjectForm';
import {useTranslations} from 'next-intl';

const SemesterSubjectCreatePage: React.FC = () => {
  const t = useTranslations();
  const entityName = t('semesterSubject', { defaultValue: 'Semester Subject' });
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
        <PageHeader title={t('create_name', { name: entityName })} onBack={handleBack} />

        <SemesterSubjectForm mode="create" embedded={false} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterSubjectCreatePage; 