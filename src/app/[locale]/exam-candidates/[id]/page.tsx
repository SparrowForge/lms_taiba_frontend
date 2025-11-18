'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateExamCandidateDetailsConfig } from '@/components/examCandidates/examCandidateConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useExamCandidates } from '@/hooks/useExamCandidates';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamCandidate } from '@/types/examCandidate';

export default function ExamCandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_CANDIDATE, { defaultValue: 'Exam Candidate' });
  const { selectedExamCandidate, loadExamCandidate, detailsStatus } = useExamCandidates();

  const resolvedParams = React.use(params);
  const examCandidateId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamCandidate(examCandidateId);
  }, [examCandidateId, loadExamCandidate]);

  const config = useCreateExamCandidateDetailsConfig(
    selectedExamCandidate,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IExamCandidate>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
