'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import ClassScheduleForm from '@/components/classSchedules/ClassScheduleForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useClassSchedules} from '@/hooks/useClassSchedules';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const ClassScheduleEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedClassSchedule, detailsStatus, loadClassSchedule } = useClassSchedules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });

  useEffect(() => {
    const classScheduleId = parseInt(resolvedParams.id);
    //getClassScheduleById(classScheduleId);
    loadClassSchedule(classScheduleId);
  }, [resolvedParams.id, loadClassSchedule]);


  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedClassSchedule || selectedClassSchedule.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/class-schedules" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <ClassScheduleForm
            mode="edit"
            classScheduleId={parseInt(resolvedParams.id)}
            initialValues={selectedClassSchedule}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ClassScheduleEditPage;
