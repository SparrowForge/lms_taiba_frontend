'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';
import {IScheduleType} from '@/types/scheduleType';

import {useCreateScheduleTypeDetailsConfig} from './scheduleTypeConfig';


interface ScheduleTypeDetailsDrawerProps {
  scheduleTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (scheduleTypeId: number) => void;
}

const ScheduleTypeDetailsDrawer: React.FC<ScheduleTypeDetailsDrawerProps> = ({
  scheduleTypeId,
  visible,
  onClose,
  onEdit,
}) => {

  const { selectedScheduleType, getScheduleTypeById, detailsStatus } = useScheduleTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SCHEDULE_TYPE, { defaultValue: 'Schedule Type' });
  useEffect(() => {
    if (visible && scheduleTypeId) {
      getScheduleTypeById(scheduleTypeId);
    }
  }, [visible, scheduleTypeId, getScheduleTypeById]);

  const handleEdit = (scheduleType: IScheduleType) => {
    onEdit(scheduleType.id);
  };

  const config = useCreateScheduleTypeDetailsConfig(
    selectedScheduleType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={scheduleTypeId} // Force remount when scheduleTypeId changes
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

export default ScheduleTypeDetailsDrawer;
