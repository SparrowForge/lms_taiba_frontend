'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS, t } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamResultForm from '@/components/examResults/ExamResultForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useExamResults } from '@/hooks/useExamResults';
import { useLocalization } from '@/hooks/useLocalization';

export default function EditExamResultPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedExamResult, loadExamResult, detailsStatus } = useExamResults();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_RESULT, { defaultValue: 'Exam Result' });

  const resolvedParams = React.use(params);
  const examResultId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamResult(examResultId);
  }, [examResultId, loadExamResult]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedExamResult || selectedExamResult.id !== examResultId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/exam-results" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <ExamResultForm
          mode="edit"
          examResultId={examResultId}
          initialValues={selectedExamResult}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
