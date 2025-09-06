'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FacultySubjectForm from '@/components/facultySubjects/FacultySubjectForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {useLocalization} from '@/hooks/useLocalization';


const FacultySubjectEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFacultySubject, detailsStatus, loadFacultySubject } = useFacultySubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY_SUBJECT, { defaultValue: 'Faculty Subject' });

  useEffect(() => {
    const facultySubjectId = parseInt(resolvedParams.id);
    //getFacultySubjectById(facultySubjectId);
    loadFacultySubject(facultySubjectId);
  }, [resolvedParams.id, loadFacultySubject]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedFacultySubject || selectedFacultySubject.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/faculty-subjects" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <FacultySubjectForm
          mode="edit"
          facultySubjectId={parseInt(resolvedParams.id)}
          initialValues={selectedFacultySubject}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultySubjectEditPage;
