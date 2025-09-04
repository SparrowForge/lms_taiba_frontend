'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateTimeSlotDetailsConfig} from '@/components/timeSlots/timeSlotConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useTimeSlots} from '@/hooks/useTimeSlots';

import {Status} from '@/types/common';
import {ITimeSlot} from '@/types/timeSlot';

export default function TimeSlotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedTimeSlot, detailsStatus, loadTimeSlot } = useTimeSlots();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.TIME_SLOT, { defaultValue: 'Time Slot' });

  const resolvedParams = React.use(params);
  const timeSlotId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getTimeSlotById(timeSlotId);
    loadTimeSlot(timeSlotId);
  }, [loadTimeSlot, timeSlotId]);

  const config = useCreateTimeSlotDetailsConfig(
    selectedTimeSlot,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ITimeSlot>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
