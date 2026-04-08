'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useEvents } from '@/hooks/useEvents';
import { useLocalization } from '@/hooks/useLocalization';

import { IEvent } from '@/types/event';

import { useCreateEventDetailsConfig } from './eventConfig';

interface EventDetailsDrawerProps {
  eventId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (eventId: number) => void;
}

const EventDetailsDrawer: React.FC<EventDetailsDrawerProps> = ({
  eventId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedEvent, loadEvent, detailsStatus } = useEvents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EVENT, { defaultValue: 'Event' });

  useEffect(() => {
    if (visible && eventId) {
      loadEvent(eventId);
    }
  }, [visible, eventId, loadEvent]);

  const handleEdit = (item: IEvent) => {
    onEdit(item.id);
  };

  const config = useCreateEventDetailsConfig(
    selectedEvent,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={eventId}
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default EventDetailsDrawer;

