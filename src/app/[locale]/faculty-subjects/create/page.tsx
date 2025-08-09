'use client';

import {useTranslations} from 'next-intl';
import React from 'react';

import FacultySubjectForm from '@/components/facultySubjects/FacultySubjectForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

const CreateFacultySubjectPage: React.FC = () => {
  const t = useTranslations();
  const entityName = t('facultySubject');

  return (
    <MainLayout>
      <PageHeader
        title={t('create_name', { name: entityName })}
        onBack={() => window.history.back()}
      >
        {/* Additional actions can go here */}
      </PageHeader>

      <FacultySubjectForm mode="create" embedded={false} />
    </MainLayout>
  );
};

export default CreateFacultySubjectPage;
