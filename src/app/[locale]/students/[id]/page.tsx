'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateStudentDetailsConfig} from '@/components/students/studentConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';
import {IStudent} from '@/types/student';

export default function StudentDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedStudent, detailsStatus, getStudentById } = useStudents();
  const t = useTranslations();
  const entityName = t('student');

  const resolvedParams = React.use(params);
  const studentId = parseInt(resolvedParams.id);

  // Load student if not already loaded
  useEffect(() => {
    getStudentById(studentId);
  }, [getStudentById, studentId]);

  const config = useCreateStudentDetailsConfig(
    selectedStudent,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
