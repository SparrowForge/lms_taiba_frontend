'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';
import WeekDayForm from '@/components/weekDays/WeekDayForm';

import {useLocalization} from '@/hooks/useLocalization';
import {useWeekDays} from '@/hooks/useWeekDays';


const WeekDayEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedWeekDay, detailsStatus, loadWeekDay } = useWeekDays();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' });

  useEffect(() => {
    const weekDayId = parseInt(resolvedParams.id);
    //getWeekDayById(weekDayId);
    loadWeekDay(weekDayId);
  }, [resolvedParams.id, loadWeekDay]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedWeekDay || selectedWeekDay.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/week-days" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
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
