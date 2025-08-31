'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateScheduleTypeDetailsConfig} from '@/components/scheduleTypes/scheduleTypeConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';
import {IScheduleType} from '@/types/scheduleType';

export default function ScheduleTypeDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedScheduleType, detailsStatus, loadScheduleType } = useScheduleTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SCHEDULE_TYPE, { defaultValue: 'Schedule Type' });

  const resolvedParams = React.use(params);
  const scheduleTypeId = parseInt(resolvedParams.id);

  // Load schedule type if not already loaded
  useEffect(() => {
    //getScheduleTypeById(scheduleTypeId);
    loadScheduleType(scheduleTypeId);
  }, [loadScheduleType, scheduleTypeId]);

  const config = useCreateScheduleTypeDetailsConfig(
    selectedScheduleType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IScheduleType>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
