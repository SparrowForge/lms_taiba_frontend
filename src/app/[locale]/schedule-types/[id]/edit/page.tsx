'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import ScheduleTypeForm from '@/components/scheduleTypes/ScheduleTypeForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';


const ScheduleTypeEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedScheduleType, detailsStatus, getScheduleTypeById } = useScheduleTypes();
  const t = useTranslations();
  const entityName = t('scheduleType');

  useEffect(() => {
    const scheduleTypeId = parseInt(resolvedParams.id);
    getScheduleTypeById(scheduleTypeId);
  }, [resolvedParams.id, getScheduleTypeById]);


  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t('loading', { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedScheduleType || selectedScheduleType.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/schedule-types')}>
                  {t('backToList_name', { name: entityName })}</Button>
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
          <PageHeader title={t('edit_name', { name: entityName })} onBack={() => router.back()} />
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
