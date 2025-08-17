'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useCreateWeekDayDetailsConfig} from '@/components/weekDays/weekDayConfig';

import {useLocalization} from '@/hooks/useLocalization';
import {useWeekDays} from '@/hooks/useWeekDays';

import {Status} from '@/types/common';
import {IWeekDay} from '@/types/weekDay';

export default function WeekDayDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedWeekDay, detailsStatus, getWeekDayById } = useWeekDays();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' });

  const resolvedParams = React.use(params);
  const weekDayId = parseInt(resolvedParams.id);

  // Load week day if not already loaded
  useEffect(() => {
    getWeekDayById(weekDayId);
  }, [getWeekDayById, weekDayId]);

  const config = useCreateWeekDayDetailsConfig(
    selectedWeekDay,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IWeekDay>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
