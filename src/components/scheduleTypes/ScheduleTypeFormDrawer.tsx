'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useScheduleTypes} from '@/hooks/useScheduleTypes';

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
  const { getScheduleTypeById, selectedScheduleType } = useScheduleTypes();
  const t = useTranslations();
  const entityName = t('scheduleType', { defaultValue: 'Schedule Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && scheduleTypeId) {
      getScheduleTypeById(scheduleTypeId);
    }
  }, [visible, mode, scheduleTypeId, getScheduleTypeById]);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={scheduleTypeId} // Force remount when scheduleTypeId changes
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
        initialValues={selectedScheduleType || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default ScheduleTypeFormDrawer;
