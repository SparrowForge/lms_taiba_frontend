'use client';

import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateStudentEducationDetailsConfig} from '@/components/studentEducations/studentEducationConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentEducations} from '@/hooks/useStudentEducations';

import {IStudentEducation} from '@/types/studentEducation';

export default function StudentEducationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const studentEducationId = parseInt(resolvedParams.id);
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_EDUCATION, { defaultValue: 'Student Education' });

  const { selectedStudentEducation, detailsStatus, loadStudentEducation } = useStudentEducations();

  React.useEffect(() => {
    //getStudentEducationById(studentEducationId);
    loadStudentEducation(studentEducationId);
  }, [studentEducationId, loadStudentEducation]);

  const config = useCreateStudentEducationDetailsConfig(
    selectedStudentEducation,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IStudentEducation>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
