'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import TimeSlotForm from '@/components/timeSlots/TimeSlotForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useTimeSlots} from '@/hooks/useTimeSlots';

import {Status} from '@/types/common';


const TimeSlotEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedTimeSlot, detailsStatus, getTimeSlotById } = useTimeSlots();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.TIME_SLOT, { defaultValue: 'Time Slot' });

  useEffect(() => {
    const timeSlotId = parseInt(resolvedParams.id);
    getTimeSlotById(timeSlotId);
  }, [resolvedParams.id, getTimeSlotById]);

  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedTimeSlot || selectedTimeSlot.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/time-slots')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}</Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
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
