'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ExamScheduleForm from '@/components/examSchedules/ExamScheduleForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useExamSchedules } from '@/hooks/useExamSchedules';
import { useLocalization } from '@/hooks/useLocalization';

const ExamScheduleEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedExamSchedule, detailsStatus, loadExamSchedule } = useExamSchedules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SCHEDULE, { defaultValue: 'Exam Schedule' });

  const examScheduleId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getExamScheduleById(examScheduleId);
    loadExamSchedule(examScheduleId);
  }, [examScheduleId, loadExamSchedule]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedExamSchedule || selectedExamSchedule.id !== examScheduleId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/exam-schedules" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <ExamScheduleForm
          mode="edit"
          examScheduleId={examScheduleId}
          initialValues={selectedExamSchedule}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ExamScheduleEditPage;
