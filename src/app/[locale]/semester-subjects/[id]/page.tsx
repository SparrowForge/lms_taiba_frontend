'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCreateSemesterSubjectDetailsConfig } from '@/components/semesterSubjects/semesterSubjectConfig';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { useSemesterSubjects } from '@/hooks/useSemesterSubjects';

import { ISemesterSubject } from '@/types/semesterSubject';

export default function SemesterSubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedSemesterSubject, detailsStatus, loadSemesterSubject } = useSemesterSubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' });

  const resolvedParams = React.use(params);
  const semesterSubjectId = parseInt(resolvedParams.id);

  // Load semester subject if not already loaded
  useEffect(() => {
    //getSemesterSubjectById(semesterSubjectId);
    loadSemesterSubject(semesterSubjectId);
  }, [loadSemesterSubject, semesterSubjectId]);

  const config = useCreateSemesterSubjectDetailsConfig(
    selectedSemesterSubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ISemesterSubject>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
