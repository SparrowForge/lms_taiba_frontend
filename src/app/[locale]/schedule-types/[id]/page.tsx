'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateScheduleTypeDetailsConfig} from '@/components/scheduleTypes/scheduleTypeConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';
import {IScheduleType} from '@/types/scheduleType';

export default function ScheduleTypeDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedScheduleType, detailsStatus, getScheduleTypeById } = useScheduleTypes();
  const t = useTranslations();
  const entityName = t('scheduleType');

  const resolvedParams = React.use(params);
  const scheduleTypeId = parseInt(resolvedParams.id);

  // Load schedule type if not already loaded
  useEffect(() => {
    getScheduleTypeById(scheduleTypeId);
  }, [getScheduleTypeById, scheduleTypeId]);

  const config = useCreateScheduleTypeDetailsConfig(
    selectedScheduleType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
