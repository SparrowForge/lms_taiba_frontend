'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SemesterSubjectForm from '@/components/semesterSubjects/SemesterSubjectForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';

const SemesterSubjectCreatePage: React.FC = () => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' });
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })} onBack={handleBack} />
          <SemesterSubjectForm mode="create" embedded={false} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterSubjectCreatePage;
