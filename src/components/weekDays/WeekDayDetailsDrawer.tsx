'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useWeekDays} from '@/hooks/useWeekDays';

import {Status} from '@/types/common';
import {IWeekDay} from '@/types/weekDay';

import {useCreateWeekDayDetailsConfig} from './weekDayConfig';

interface WeekDayDetailsDrawerProps {
  weekDayId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (weekDayId: number) => void;
}

const WeekDayDetailsDrawer: React.FC<WeekDayDetailsDrawerProps> = ({
  weekDayId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedWeekDay, loadWeekDay, detailsStatus } = useWeekDays();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' });
  useEffect(() => {
    if (visible && weekDayId) {
      //getWeekDayById(weekDayId);
      loadWeekDay(weekDayId);
    }
  }, [visible, weekDayId, loadWeekDay]);

  const handleEdit = (weekDay: IWeekDay) => {
    onEdit(weekDay.id);
  };

  const config = useCreateWeekDayDetailsConfig(
    selectedWeekDay,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={weekDayId}
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

export default WeekDayDetailsDrawer;
