'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamMCQQuestionForm from '@/components/examMCQQuestions/ExamMCQQuestionForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import { IQuestionsPayload } from '@/enums/question';
import QuestionForm from '@/components/examMCQQuestions/QuestionForm';
import { useExamMCQQuestions } from '@/hooks/useExamMCQQuestions';


export default function CreateExamMCQQuestionPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });
    const [submittingQuestions, setSubmittingQuestions] = useState(false)
    const {createMultipleExamMCQQuestion} = useExamMCQQuestions()

  const handleSubmitQuestions = async (payload: IQuestionsPayload) => {
    try {
      setSubmittingQuestions(true)
      console.log("Submitting questions:", payload)
       await createMultipleExamMCQQuestion(payload)
    } finally {
      setSubmittingQuestions(false)
    }
  }


  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        {/* <ExamMCQQuestionForm mode="create" /> */}
         <QuestionForm
          mode="create"
          onSubmit={handleSubmitQuestions}
          isLoading={submittingQuestions}
      />
      </MainLayout>
    </ProtectedRoute>
  );
}
