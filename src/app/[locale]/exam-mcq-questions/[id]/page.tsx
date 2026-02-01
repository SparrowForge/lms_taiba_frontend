'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateExamMCQQuestionDetailsConfig } from '@/components/examMCQQuestions/examMCQQuestionConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useExamMCQQuestions } from '@/hooks/useExamMCQQuestions';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamMCQQuestion } from '@/types/examMCQQuestion';

export default function ExamMCQQuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });
  const { selectedExamMCQQuestion, loadExamMCQQuestion, detailsStatus } = useExamMCQQuestions();

  const resolvedParams = React.use(params);
  const examMCQQuestionId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamMCQQuestion(examMCQQuestionId);
  }, [examMCQQuestionId, loadExamMCQQuestion]);

  const config = useCreateExamMCQQuestionDetailsConfig(
    selectedExamMCQQuestion,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IExamMCQQuestion>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
