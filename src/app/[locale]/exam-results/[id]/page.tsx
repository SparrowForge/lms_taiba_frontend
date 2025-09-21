'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateExamResultDetailsConfig } from '@/components/examResults/examResultConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useExamResults } from '@/hooks/useExamResults';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamResult } from '@/types/examResult';

export default function ExamResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_RESULT, { defaultValue: 'Exam Result' });
  const { selectedExamResult, loadExamResult, detailsStatus } = useExamResults();

  const resolvedParams = React.use(params);
  const examResultId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamResult(examResultId);
  }, [examResultId, loadExamResult]);

  const config = useCreateExamResultDetailsConfig(
    selectedExamResult,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IExamResult>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
