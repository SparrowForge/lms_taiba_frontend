'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentForm from '@/components/students/StudentForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';


const StudentEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedStudent, detailsStatus, getStudentById } = useStudents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });

  const studentId = parseInt(resolvedParams.id);

  useEffect(() => {
    getStudentById(studentId);
  }, [studentId, getStudentById]);


  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedStudent || selectedStudent.id !== studentId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/students" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <StudentForm
            mode="edit"
            studentId={studentId}
            initialValues={selectedStudent}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default StudentEditPage;
