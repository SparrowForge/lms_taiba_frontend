'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useEventTypes } from '@/hooks/useEventTypes';
import { useLocalization } from '@/hooks/useLocalization';

import EventTypeForm from './EventTypeForm';

interface EventTypeFormDrawerProps {
  mode: 'create' | 'edit';
  eventTypeId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const EventTypeFormDrawer: React.FC<EventTypeFormDrawerProps> = ({
  mode,
  eventTypeId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedEventType, loadEventType, detailsStatus } = useEventTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EVENT_TYPE, { defaultValue: 'Event Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && eventTypeId) {
      loadEventType(eventTypeId);
    }
  }, [visible, mode, eventTypeId, loadEventType]);

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
      key={eventTypeId}
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
      <EventTypeForm
        mode={mode}
        eventTypeId={eventTypeId}
        initialValues={selectedEventType || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default EventTypeFormDrawer;

