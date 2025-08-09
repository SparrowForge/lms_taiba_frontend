'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SemesterSubjectForm from '@/components/semesterSubjects/SemesterSubjectForm';
import {PageHeader} from '@/components/ui/PageHeader';

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
          <PageHeader title={t('create_name', { name: entityName })} onBack={handleBack} />
          <SemesterSubjectForm mode="create" embedded={false} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterSubjectCreatePage;
