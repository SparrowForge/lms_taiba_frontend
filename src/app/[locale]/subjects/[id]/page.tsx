'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateSubjectDetailsConfig} from '@/components/subjects/subjectConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {ISubject} from '@/types/subject';

export default function SubjectDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedSubject, detailsStatus, getSubjectById } = useSubjects();
  const t = useTranslations();
  const entityName = t('subject');

  const resolvedParams = React.use(params);
  const subjectId = parseInt(resolvedParams.id);

  // Load subject if not already loaded
  useEffect(() => {
    getSubjectById(subjectId);
  }, [getSubjectById, subjectId]);

  const config = useCreateSubjectDetailsConfig(
    selectedSubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<ISubject>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
