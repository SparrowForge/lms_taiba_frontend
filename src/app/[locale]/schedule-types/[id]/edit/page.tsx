'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import ScheduleTypeForm from '@/components/scheduleTypes/ScheduleTypeForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {IScheduleType} from '@/types/scheduleType';


interface PageProps {
  params: Promise<{ id: string }>;
}

const ScheduleTypeEditPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { scheduleTypes, listStatus, loadScheduleTypes, getScheduleTypeById, loadScheduleType } =
    useScheduleTypes();
  const [item, setItem] = useState<IScheduleType | null>(null);
  const t = useTranslations();
  const entityName = t('scheduleType');

  useEffect(() => {
    const itemId = parseInt(resolvedParams.id);
    const found = getScheduleTypeById(itemId);
    if (found) setItem(found);
    else loadScheduleType(itemId);
  }, [resolvedParams.id, getScheduleTypeById, loadScheduleType]);

  useEffect(() => {
    if (scheduleTypes.length === 0) loadScheduleTypes();
  }, [scheduleTypes.length, loadScheduleTypes]);

  useEffect(() => {
    if (scheduleTypes.length > 0) {
      const found = getScheduleTypeById(parseInt(resolvedParams.id));
      if (found) setItem(found);
    }
  }, [scheduleTypes, resolvedParams.id, getScheduleTypeById]);

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            {t('loading', { defaultValue: 'Loading...' })}
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!item) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/schedule-types')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => router.back();

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <ScheduleTypeForm
            mode="edit"
            scheduleTypeId={parseInt(resolvedParams.id)}
          initialValues={{ name: item.name, status: item.status }}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ScheduleTypeEditPage;
