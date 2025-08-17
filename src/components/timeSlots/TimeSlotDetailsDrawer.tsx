'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useTimeSlots} from '@/hooks/useTimeSlots';

import {Status} from '@/types/common';
import {ITimeSlot} from '@/types/timeSlot';

import {useCreateTimeSlotDetailsConfig} from './timeSlotConfig';

interface TimeSlotDetailsDrawerProps {
  timeSlotId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (timeSlotId: number) => void;
}

const TimeSlotDetailsDrawer: React.FC<TimeSlotDetailsDrawerProps> = ({
  timeSlotId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedTimeSlot, getTimeSlotById, detailsStatus } = useTimeSlots();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.TIME_SLOT, { defaultValue: 'Time Slot' });

  useEffect(() => {
    if (visible && timeSlotId) {
      getTimeSlotById(timeSlotId);
    }
  }, [visible, timeSlotId, getTimeSlotById]);

  const handleEdit = (timeSlot: ITimeSlot) => {
    onEdit(timeSlot.id);
  };

  const config = useCreateTimeSlotDetailsConfig(
    selectedTimeSlot,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={timeSlotId} // Force remount when timeSlotId changes
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

export default TimeSlotDetailsDrawer;
