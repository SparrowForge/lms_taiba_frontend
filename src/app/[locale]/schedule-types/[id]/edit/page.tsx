'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import ScheduleTypeForm from '@/components/scheduleTypes/ScheduleTypeForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';


const ScheduleTypeEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedScheduleType, detailsStatus, loadScheduleType } = useScheduleTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SCHEDULE_TYPE, { defaultValue: 'Schedule Type' });

  useEffect(() => {
    const scheduleTypeId = parseInt(resolvedParams.id);
    //getScheduleTypeById(scheduleTypeId);
    loadScheduleType(scheduleTypeId);
  }, [resolvedParams.id, loadScheduleType]);


  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedScheduleType || selectedScheduleType.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/schedule-types" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <ScheduleTypeForm
            mode="edit"
            scheduleTypeId={parseInt(resolvedParams.id)}
            initialValues={selectedScheduleType}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ScheduleTypeEditPage;
