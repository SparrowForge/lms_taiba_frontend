'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import TimeSlotForm from '@/components/timeSlots/TimeSlotForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useTimeSlots} from '@/hooks/useTimeSlots';

import {Status} from '@/types/common';


const TimeSlotEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedTimeSlot, detailsStatus, loadTimeSlot } = useTimeSlots();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.TIME_SLOT, { defaultValue: 'Time Slot' });

  useEffect(() => {
    const timeSlotId = parseInt(resolvedParams.id);
    //getTimeSlotById(timeSlotId);
    loadTimeSlot(timeSlotId);
  }, [resolvedParams.id, loadTimeSlot]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedTimeSlot || selectedTimeSlot.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/time-slots" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
        <TimeSlotForm
          mode="edit"
          timeSlotId={parseInt(resolvedParams.id)}
          initialValues={selectedTimeSlot}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default TimeSlotEditPage;
