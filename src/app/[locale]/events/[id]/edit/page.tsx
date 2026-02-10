'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import EventForm from '@/components/events/EventForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useEvents } from '@/hooks/useEvents';
import { useLocalization } from '@/hooks/useLocalization';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedEvent, loadEvent, detailsStatus } = useEvents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EVENT, { defaultValue: 'Event' });

  const resolvedParams = React.use(params);
  const eventId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadEvent(eventId);
  }, [eventId, loadEvent]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedEvent || selectedEvent.id !== eventId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/events" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <EventForm mode="edit" eventId={eventId} initialValues={selectedEvent} />
      </MainLayout>
    </ProtectedRoute>
  );
}

