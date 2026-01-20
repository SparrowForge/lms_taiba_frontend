'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import QuestionForm from '@/components/examMCQQuestions/QuestionForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import { useMcqQuestions } from '@/hooks/useMcqQuestions';

import { IMCQQuestionBulkCreate } from '@/types/mcqQuestion';
import { toast } from 'react-toastify';

export default function CreateExamMCQQuestionPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });
    const [submittingQuestions, setSubmittingQuestions] = useState(false)
    const {createBulkMcqQuestions, actionStatus} = useMcqQuestions()

  const handleSubmitQuestions = async (payload: IMCQQuestionBulkCreate) => {
    try {
      setSubmittingQuestions(true)
      await createBulkMcqQuestions(payload)
      toast.success(actionStatus.message)
      router.push(`/dashboard/course`)
  
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
