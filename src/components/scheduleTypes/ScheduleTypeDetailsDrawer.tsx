'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';


import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';


import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';
import {IScheduleType} from '@/types/scheduleType';

import {useCreateScheduleTypeDetailsConfig} from './scheduleTypeConfig';


interface Props {
  scheduleTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (scheduleTypeId: number) => void;
}

const ScheduleTypeDetailsDrawer: React.FC<Props> = ({
  scheduleTypeId,
  visible,
  onClose,
  onEdit,
}) => {
  const [item, setItem] = useState<IScheduleType | null>(null);
  const { scheduleTypes, getScheduleTypeById, loadScheduleType, detailsStatus } =
    useScheduleTypes();
  const t = useTranslations();
  const entityName = t('scheduleType', { defaultValue: 'Schedule Type' });

  useEffect(() => {
    if (visible && scheduleTypeId) {
      const existing = getScheduleTypeById(scheduleTypeId);
      if (existing) setItem(existing);
      else loadScheduleType(scheduleTypeId);
    } else {
      setItem(null);
    }
  }, [visible, scheduleTypeId, getScheduleTypeById, loadScheduleType]);

  useEffect(() => {
    if (scheduleTypeId && scheduleTypes.length > 0) {
      const found = getScheduleTypeById(scheduleTypeId);
      if (found) setItem(found);
    }
  }, [scheduleTypes, scheduleTypeId, getScheduleTypeById]);

  const handleEdit = (ct: IScheduleType) => onEdit(ct.id);

  const config = useCreateScheduleTypeDetailsConfig(
    item,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    { embedded: true, onEdit: handleEdit },
  );

  return (
    <Drawer
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
