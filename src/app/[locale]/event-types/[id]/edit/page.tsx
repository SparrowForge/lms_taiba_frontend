'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import EventTypeForm from '@/components/eventTypes/EventTypeForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useEventTypes } from '@/hooks/useEventTypes';
import { useLocalization } from '@/hooks/useLocalization';

export default function EditEventTypePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedEventType, loadEventType, detailsStatus } = useEventTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EVENT_TYPE, { defaultValue: 'Event Type' });

  const resolvedParams = React.use(params);
  const eventTypeId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadEventType(eventTypeId);
  }, [eventTypeId, loadEventType]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedEventType || selectedEventType.id !== eventTypeId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/event-types" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <EventTypeForm mode="edit" eventTypeId={eventTypeId} initialValues={selectedEventType} />
      </MainLayout>
    </ProtectedRoute>
  );
}

