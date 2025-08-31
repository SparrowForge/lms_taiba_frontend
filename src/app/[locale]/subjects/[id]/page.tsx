'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateSubjectDetailsConfig} from '@/components/subjects/subjectConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {ISubject} from '@/types/subject';

export default function SubjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedSubject, detailsStatus, loadSubject } = useSubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' });

  const resolvedParams = React.use(params);
  const subjectId = parseInt(resolvedParams.id);

  // Load subject if not already loaded
  useEffect(() => {
    //getSubjectById(subjectId);
    loadSubject(subjectId);
  }, [loadSubject, subjectId]);

  const config = useCreateSubjectDetailsConfig(
    selectedSubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
