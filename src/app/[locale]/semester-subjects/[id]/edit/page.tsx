'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SemesterSubjectForm from '@/components/semesterSubjects/SemesterSubjectForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';


const SemesterSubjectEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedSemesterSubject, detailsStatus, loadSemesterSubject } = useSemesterSubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' });

  useEffect(() => {
    const semesterSubjectId = parseInt(resolvedParams.id);
    //getSemesterSubjectById(semesterSubjectId);
    loadSemesterSubject(semesterSubjectId);
  }, [resolvedParams.id, loadSemesterSubject]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedSemesterSubject || selectedSemesterSubject.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/semester-subjects" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <SemesterSubjectForm
          mode="edit"
          semesterSubjectId={parseInt(resolvedParams.id)}
          initialValues={selectedSemesterSubject}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SemesterSubjectEditPage;
