'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useEventTypes } from '@/hooks/useEventTypes';
import { useLocalization } from '@/hooks/useLocalization';

import { IEventType } from '@/types/eventType';

import { useCreateEventTypeDetailsConfig } from './eventTypeConfig';

interface EventTypeDetailsDrawerProps {
  eventTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (eventTypeId: number) => void;
}

const EventTypeDetailsDrawer: React.FC<EventTypeDetailsDrawerProps> = ({
  eventTypeId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedEventType, loadEventType, detailsStatus } = useEventTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EVENT_TYPE, { defaultValue: 'Event Type' });

  useEffect(() => {
    if (visible && eventTypeId) {
      loadEventType(eventTypeId);
    }
  }, [visible, eventTypeId, loadEventType]);

  const handleEdit = (item: IEventType) => {
    onEdit(item.id);
  };

  const config = useCreateEventTypeDetailsConfig(
    selectedEventType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={eventTypeId}
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

export default EventTypeDetailsDrawer;

