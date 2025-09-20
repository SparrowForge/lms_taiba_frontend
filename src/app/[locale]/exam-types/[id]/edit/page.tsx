'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS, t } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamTypeForm from '@/components/examTypes/ExamTypeForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useExamTypes } from '@/hooks/useExamTypes';
import { useLocalization } from '@/hooks/useLocalization';


export default function EditExamTypePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedExamType, loadExamType, detailsStatus } = useExamTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_TYPE, { defaultValue: 'Exam Type' });

  const resolvedParams = React.use(params);
  const examTypeId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getExamTypeById(examTypeId);
    loadExamType(examTypeId);
  }, [examTypeId, loadExamType]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedExamType || selectedExamType.id !== examTypeId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/exam-types" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <ExamTypeForm mode="edit" examTypeId={examTypeId} initialValues={selectedExamType} />
      </MainLayout>
    </ProtectedRoute>
  );
}
