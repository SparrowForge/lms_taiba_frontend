'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamCandidateForm from '@/components/examCandidates/ExamCandidateForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useExamCandidates } from '@/hooks/useExamCandidates';
import { useLocalization } from '@/hooks/useLocalization';

export default function EditExamCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedExamCandidate, loadExamCandidate, detailsStatus } = useExamCandidates();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_CANDIDATE, { defaultValue: 'Exam Candidate' });

  const resolvedParams = React.use(params);
  const examCandidateId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamCandidate(examCandidateId);
  }, [examCandidateId, loadExamCandidate]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedExamCandidate || selectedExamCandidate.id !== examCandidateId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/exam-candidates" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <ExamCandidateForm
          mode="edit"
          examCandidateId={examCandidateId}
          initialValues={selectedExamCandidate}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
