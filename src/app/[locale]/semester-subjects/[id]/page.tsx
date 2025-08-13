'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateSemesterSubjectDetailsConfig} from '@/components/semesterSubjects/semesterSubjectConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

import {Status} from '@/types/common';
import {ISemesterSubject} from '@/types/semesterSubject';

export default function SemesterSubjectDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedSemesterSubject, detailsStatus, getSemesterSubjectById } = useSemesterSubjects();
  const t = useTranslations();
  const entityName = t('semesterSubject');

  const resolvedParams = React.use(params);
  const semesterSubjectId = parseInt(resolvedParams.id);

  // Load semester subject if not already loaded
  useEffect(() => {
    getSemesterSubjectById(semesterSubjectId);
  }, [getSemesterSubjectById, semesterSubjectId]);

  const config = useCreateSemesterSubjectDetailsConfig(
    selectedSemesterSubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
