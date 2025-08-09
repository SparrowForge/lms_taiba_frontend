'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import ScheduleTypeForm from '@/components/scheduleTypes/ScheduleTypeForm';
import {PageHeader} from '@/components/ui/PageHeader';

export default function CreateScheduleTypePage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('scheduleType', { defaultValue: 'Schedule Type' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <ScheduleTypeForm mode="create" />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
