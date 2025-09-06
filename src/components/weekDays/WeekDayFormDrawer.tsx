'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useWeekDays} from '@/hooks/useWeekDays';

import {Status} from '@/types/common';

import WeekDayForm from './WeekDayForm';

interface Props {
  mode: 'create' | 'edit';
  weekDayId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const WeekDayFormDrawer: React.FC<Props> = ({ mode, weekDayId, visible, onCancel, onSuccess }) => {
  const { getWeekDayById, selectedWeekDay, loadWeekDay, detailsStatus } = useWeekDays();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' });

  useEffect(() => {
    if (visible && mode === 'edit' && weekDayId) {
      //getWeekDayById(weekDayId);
      loadWeekDay(weekDayId);
    }
  }, [visible, mode, weekDayId, loadWeekDay]);

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
      key={weekDayId}
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
