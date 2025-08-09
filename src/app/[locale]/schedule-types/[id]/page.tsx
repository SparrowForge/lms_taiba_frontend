'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateScheduleTypeDetailsConfig} from '@/components/scheduleTypes/scheduleTypeConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';
import {IScheduleType} from '@/types/scheduleType';

interface PageProps {
  params: Promise<{ id: string }>;
}

const ScheduleTypeDetailPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
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

  const config = useCreateScheduleTypeDetailsConfig(
    item,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IScheduleType>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ScheduleTypeDetailPage;
