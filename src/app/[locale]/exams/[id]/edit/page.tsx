'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamForm from '@/components/exams/ExamForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';

const ExamEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedExam, detailsStatus, loadExam } = useExams();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });

  const examId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getExamById(examId);
    loadExam(examId);
  }, [examId, loadExam]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedExam || selectedExam.id !== examId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/exams" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <ExamForm mode="edit" examId={examId} initialValues={selectedExam} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ExamEditPage;
