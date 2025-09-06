'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateClassScheduleDetailsConfig} from '@/components/classSchedules/classScheduleConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useClassSchedules} from '@/hooks/useClassSchedules';
import {useLocalization} from '@/hooks/useLocalization';

import {IClassSchedule} from '@/types/classSchedule';
import {Status} from '@/types/common';

export default function ClassScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedClassSchedule, detailsStatus, loadClassSchedule } = useClassSchedules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });

  const resolvedParams = React.use(params);
  const classScheduleId = parseInt(resolvedParams.id);

  // Load class schedule if not already loaded
  useEffect(() => {
    //getClassScheduleById(classScheduleId);
    loadClassSchedule(classScheduleId);
  }, [loadClassSchedule, classScheduleId]);

  const config = useCreateClassScheduleDetailsConfig(
    selectedClassSchedule,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IClassSchedule>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
