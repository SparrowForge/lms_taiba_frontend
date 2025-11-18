'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateExamTypeDetailsConfig } from '@/components/examTypes/examTypeConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useExamTypes } from '@/hooks/useExamTypes';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamType } from '@/types/examType';

export default function ExamTypeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.EXAM_TYPE, { defaultValue: 'Exam Type' });
  const { selectedExamType, loadExamType, detailsStatus } = useExamTypes();

  const resolvedParams = React.use(params);
  const examTypeId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadExamType(examTypeId);
  }, [examTypeId, loadExamType]);

  const config = useCreateExamTypeDetailsConfig(
    selectedExamType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IExamType>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
