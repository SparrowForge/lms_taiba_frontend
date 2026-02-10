'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useEvents } from '@/hooks/useEvents';
import { useLocalization } from '@/hooks/useLocalization';

import EventForm from './EventForm';

interface EventFormDrawerProps {
  mode: 'create' | 'edit';
  eventId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const EventFormDrawer: React.FC<EventFormDrawerProps> = ({
  mode,
  eventId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedEvent, loadEvent, detailsStatus } = useEvents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EVENT, { defaultValue: 'Event' });

  useEffect(() => {
    if (visible && mode === 'edit' && eventId) {
      loadEvent(eventId);
    }
  }, [visible, mode, eventId, loadEvent]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={eventId}
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <EventForm
        mode={mode}
        eventId={eventId}
        initialValues={selectedEvent || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default EventFormDrawer;

