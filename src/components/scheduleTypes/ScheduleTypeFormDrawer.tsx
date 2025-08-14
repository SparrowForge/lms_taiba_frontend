'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SCHEDULE_TYPE, { defaultValue: 'Schedule Type' });

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
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
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
