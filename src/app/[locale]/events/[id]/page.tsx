'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';
import { useCreateEventDetailsConfig } from '@/components/events/eventConfig';

import { useEvents } from '@/hooks/useEvents';
import { useLocalization } from '@/hooks/useLocalization';

import { IEvent } from '@/types/event';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.EVENT, { defaultValue: 'Event' });
  const { selectedEvent, loadEvent, detailsStatus } = useEvents();

  const resolvedParams = React.use(params);
  const eventId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadEvent(eventId);
  }, [eventId, loadEvent]);

  const config = useCreateEventDetailsConfig(
    selectedEvent,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IEvent>} />
      </MainLayout>
    </ProtectedRoute>
  );
}

