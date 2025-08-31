'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentEducationForm from '@/components/studentEducations/StudentEducationForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';


import {useLocalization} from '@/hooks/useLocalization';
import {useStudentEducations} from '@/hooks/useStudentEducations';

import {Status} from '@/types/common';


export default function StudentEducationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const studentEducationId = parseInt(resolvedParams.id);
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_EDUCATION, { defaultValue: 'Student Education' });

  const { selectedStudentEducation, detailsStatus, loadStudentEducation } = useStudentEducations();

  React.useEffect(() => {
    //getStudentEducationById(studentEducationId);
    loadStudentEducation(studentEducationId);
  }, [studentEducationId, loadStudentEducation]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedStudentEducation || selectedStudentEducation.id !== studentEducationId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/student-educations" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
      <StudentEducationForm
            mode="edit"
            studentEducationId={studentEducationId}
            initialValues={selectedStudentEducation || undefined}
          />
      </MainLayout>
    </ProtectedRoute>
  );
}
