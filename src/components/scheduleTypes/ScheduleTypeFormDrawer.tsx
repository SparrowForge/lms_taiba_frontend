'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {IScheduleType} from '@/types/scheduleType';

import ScheduleTypeForm from './ScheduleTypeForm';


interface Props {
  mode: 'create' | 'edit';
  scheduleTypeId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ScheduleTypeFormDrawer: React.FC<Props> = ({
  mode,
  scheduleTypeId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<IScheduleType> | undefined>();
  const { scheduleTypes, getScheduleTypeById, loadScheduleType } = useScheduleTypes();
  const t = useTranslations();
  const entityName = t('scheduleType', { defaultValue: 'Schedule Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && scheduleTypeId) {
      const existing = getScheduleTypeById(scheduleTypeId);
      if (existing) setInitialValues(existing);
      else loadScheduleType(scheduleTypeId);
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, scheduleTypeId, getScheduleTypeById, loadScheduleType]);

  useEffect(() => {
    if (mode === 'edit' && scheduleTypeId && scheduleTypes.length > 0) {
      const found = getScheduleTypeById(scheduleTypeId);
      if (found) setInitialValues(found);
    }
  }, [scheduleTypes, scheduleTypeId, mode, getScheduleTypeById]);

  const handleSuccess = () => {
    onSuccess();
    setInitialValues(undefined);
  };
  const handleCancel = () => {
    onCancel();
    setInitialValues(undefined);
  };

  return (
    <Drawer
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <ScheduleTypeForm
        mode={mode}
        scheduleTypeId={scheduleTypeId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default ScheduleTypeFormDrawer;
