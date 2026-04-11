'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';
import { useCreateEventTypeDetailsConfig } from '@/components/eventTypes/eventTypeConfig';

import { useEventTypes } from '@/hooks/useEventTypes';
import { useLocalization } from '@/hooks/useLocalization';

import { IEventType } from '@/types/eventType';

export default function EventTypeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.EVENT_TYPE, { defaultValue: 'Event Type' });
  const { selectedEventType, loadEventType, detailsStatus } = useEventTypes();

  const resolvedParams = React.use(params);
  const eventTypeId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadEventType(eventTypeId);
  }, [eventTypeId, loadEventType]);

  const config = useCreateEventTypeDetailsConfig(
    selectedEventType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IEventType>} />
      </MainLayout>
    </ProtectedRoute>
  );
}

