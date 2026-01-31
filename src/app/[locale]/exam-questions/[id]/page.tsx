'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateExamQuestionDetailsConfig } from '@/components/examQuestions/examQuestionConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useExamQuestions } from '@/hooks/useExamQuestions';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamQuestion } from '@/types/examQuestion';

export default function ExamQuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_QUESTION, { defaultValue: 'Exam Question' });
  const { selectedExamQuestion, loadExamQuestion, detailsStatus } = useExamQuestions();

  const resolvedParams = React.use(params);
  const examQuestionId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamQuestion(examQuestionId);
  }, [examQuestionId, loadExamQuestion]);

  const config = useCreateExamQuestionDetailsConfig(
    selectedExamQuestion,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IExamQuestion>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
