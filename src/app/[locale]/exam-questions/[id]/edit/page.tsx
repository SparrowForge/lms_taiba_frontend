'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamQuestionForm from '@/components/examQuestions/ExamQuestionForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useExamQuestions } from '@/hooks/useExamQuestions';
import { useLocalization } from '@/hooks/useLocalization';

export default function EditExamQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedExamQuestion, loadExamQuestion, detailsStatus } = useExamQuestions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_QUESTION, { defaultValue: 'Exam Question' });

  const resolvedParams = React.use(params);
  const examQuestionId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamQuestion(examQuestionId);
  }, [examQuestionId, loadExamQuestion]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedExamQuestion || selectedExamQuestion.id !== examQuestionId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/exam-questions" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <ExamQuestionForm
          mode="edit"
          examQuestionId={examQuestionId}
          initialValues={selectedExamQuestion}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
