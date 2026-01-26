'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import QuestionForm from '@/components/examMCQQuestions/QuestionForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import { useMcqQuestions } from '@/hooks/useMcqQuestions';

import { getErrorMessage } from '@/types/errors';
import { IMCQQuestionBulkCreate } from '@/types/mcqQuestion';

export default function CreateExamMCQQuestionPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });

    const {createBulkMcqQuestions} = useMcqQuestions()

  const handleSubmitQuestions = async (payload: IMCQQuestionBulkCreate) => {
    try {
     
      await createBulkMcqQuestions(payload)
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
      return router.back();
  
    } catch (error: unknown) {
        let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
          name: entityName,
          defaultValue: `Failed to create ${entityName.toLowerCase()}`,
        });
  
        // Try to extract error message from API response
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as { response?: { data?: { message?: string } } };
          if (apiError.response?.data?.message) {
            errorMessage = apiError.response.data.message;
          }
        } else {
          // Use the helper function for other error types
          errorMessage = getErrorMessage(error);
        }
  
        toast.error(errorMessage);
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

      />
      </MainLayout>
    </ProtectedRoute>
  );
}
