'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamMCQQuestionForm from '@/components/examMCQQuestions/ExamMCQQuestionForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useExamMCQQuestions } from '@/hooks/useExamMCQQuestions';
import { useLocalization } from '@/hooks/useLocalization';

export default function EditExamMCQQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedExamMCQQuestion, loadExamMCQQuestion, detailsStatus } = useExamMCQQuestions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });

  const resolvedParams = React.use(params);
  const examMCQQuestionId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamMCQQuestion(examMCQQuestionId);
  }, [examMCQQuestionId, loadExamMCQQuestion]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedExamMCQQuestion || selectedExamMCQQuestion.id !== examMCQQuestionId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/exam-mcq-questions" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <ExamMCQQuestionForm
          mode="edit"
          examMCQQuestionId={examMCQQuestionId}
          initialValues={selectedExamMCQQuestion}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
