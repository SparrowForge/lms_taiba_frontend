'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useTimeSlots} from '@/hooks/useTimeSlots';

import { Status } from '@/types/common';

import TimeSlotForm from './TimeSlotForm';

interface Props {
  mode: 'create' | 'edit';
  timeSlotId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const TimeSlotFormDrawer: React.FC<Props> = ({
  mode,
  timeSlotId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getTimeSlotById, selectedTimeSlot, loadTimeSlot, detailsStatus } = useTimeSlots();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.TIME_SLOT, { defaultValue: 'Time Slot' });

  useEffect(() => {
    if (visible && mode === 'edit' && timeSlotId) {
      //getTimeSlotById(timeSlotId);
      loadTimeSlot(timeSlotId);
    }
  }, [visible, mode, timeSlotId, loadTimeSlot]);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleCancel = () => {
    onCancel();
  };

  if( mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin/>;
  }

  return (
    <Drawer
      key={timeSlotId} // Force remount when timeSlotId changes
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
      <TimeSlotForm
        mode={mode}
        timeSlotId={timeSlotId}
        initialValues={selectedTimeSlot || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default TimeSlotFormDrawer;
