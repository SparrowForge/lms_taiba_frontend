'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateExamScheduleDetailsConfig } from '@/components/examSchedules/examScheduleConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useExamSchedules } from '@/hooks/useExamSchedules';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamSchedule } from '@/types/examSchedule';

export default function ExamScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedExamSchedule, detailsStatus, loadExamSchedule } = useExamSchedules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SCHEDULE, { defaultValue: 'Exam Schedule' });

  const resolvedParams = React.use(params);
  const examScheduleId = parseInt(resolvedParams.id);

  // Load exam schedule if not already loaded
  useEffect(() => {
    //getExamScheduleById(examScheduleId);
    loadExamSchedule(examScheduleId);
  }, [loadExamSchedule, examScheduleId]);

  const config = useCreateExamScheduleDetailsConfig(
    selectedExamSchedule,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IExamSchedule>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
