'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

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
  const t = useTranslations();
  const entityName = t('scheduleType', { defaultValue: 'Schedule Type' });
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
      title={t('details_name', { name: entityName })}
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
