'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useWeekDays} from '@/hooks/useWeekDays';

import WeekDayForm from './WeekDayForm';


interface Props {
  mode: 'create' | 'edit';
  weekDayId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const WeekDayFormDrawer: React.FC<Props> = ({
  mode,
  weekDayId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getWeekDayById, selectedWeekDay } = useWeekDays();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' });

  useEffect(() => {
    if (visible && mode === 'edit' && weekDayId) {
      getWeekDayById(weekDayId);
    }
  }, [visible, mode, weekDayId, getWeekDayById]);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={roomTypeId} // Force remount when roomTypeId changes
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
      <WeekDayForm
        mode={mode}
        weekDayId={weekDayId}
        initialValues={selectedWeekDay || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default WeekDayFormDrawer;
