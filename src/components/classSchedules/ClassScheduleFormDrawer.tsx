'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useClassSchedules} from '@/hooks/useClassSchedules';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';

import ClassScheduleForm from './ClassScheduleForm';

interface Props {
  mode: 'create' | 'edit';
  classScheduleId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ClassScheduleFormDrawer: React.FC<Props> = ({
  mode,
  classScheduleId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getClassScheduleById, selectedClassSchedule, loadClassSchedule, detailsStatus } =
    useClassSchedules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });

  useEffect(() => {
    if (visible && mode === 'edit' && classScheduleId) {
      //getClassScheduleById(classScheduleId);
      loadClassSchedule(classScheduleId);
    }
  }, [visible, mode, classScheduleId, loadClassSchedule]);

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
      key={classScheduleId}
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
      <ClassScheduleForm
        mode={mode}
        classScheduleId={classScheduleId}
        initialValues={selectedClassSchedule || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default ClassScheduleFormDrawer;
