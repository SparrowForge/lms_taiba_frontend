'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import QuestionForm from '@/components/examQuestions/QuestionForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useExamQuestions } from '@/hooks/useExamQuestions';
import { useLocalization } from '@/hooks/useLocalization';


import { getErrorMessage } from '@/types/errors';
import { IExamQuestionBulkCreate } from '@/types/examQuestion';

export default function CreateExamQuestionPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.EXAM_QUESTION, { defaultValue: 'Exam Question' });

  const { createMultipleExamQuestion } = useExamQuestions();

  const handleSubmitQuestions = async (payload: IExamQuestionBulkCreate) => {
    try {
      await createMultipleExamQuestion(payload);
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
      return router.back();
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to create ${entityName.toLowerCase()}`,
      });

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <QuestionForm mode="create" onSubmit={handleSubmitQuestions} />
      </MainLayout>
    </ProtectedRoute>
  );
}
