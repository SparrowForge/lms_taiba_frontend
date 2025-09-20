'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateExamDetailsConfig } from '@/components/exams/examConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';

import { IExam } from '@/types/exam';

export default function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedExam, detailsStatus, loadExam } = useExams();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });

  const resolvedParams = React.use(params);
  const examId = parseInt(resolvedParams.id);

  // Load exam if not already loaded
  useEffect(() => {
    //getExamById(examId);
    loadExam(examId);
  }, [loadExam, examId]);

  const config = useCreateExamDetailsConfig(
    selectedExam,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IExam>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
