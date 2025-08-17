'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';
import WeekDayForm from '@/components/weekDays/WeekDayForm';

import {useLocalization} from '@/hooks/useLocalization';
import {useWeekDays} from '@/hooks/useWeekDays';

import {Status} from '@/types/common';


const WeekDayEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedWeekDay, detailsStatus, getWeekDayById } = useWeekDays();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' });

  useEffect(() => {
    const weekDayId = parseInt(resolvedParams.id);
    getWeekDayById(weekDayId);
  }, [resolvedParams.id, getWeekDayById]);


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

  if (!selectedWeekDay || selectedWeekDay.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/week-days')}>
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
          <WeekDayForm
            mode="edit"
            weekDayId={parseInt(resolvedParams.id)}
            initialValues={selectedWeekDay}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default WeekDayEditPage;
