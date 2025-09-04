'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateStudentDetailsConfig} from '@/components/students/studentConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';
import {IStudent} from '@/types/student';

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedStudent, detailsStatus, loadStudent } = useStudents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });

  const resolvedParams = React.use(params);
  const studentId = parseInt(resolvedParams.id);

  // Load student if not already loaded
  useEffect(() => {
    //getStudentById(studentId);
    loadStudent(studentId);
  }, [loadStudent, studentId]);

  const config = useCreateStudentDetailsConfig(
    selectedStudent,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IStudent>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
