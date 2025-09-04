'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useClassSchedules} from '@/hooks/useClassSchedules';
import {useLocalization} from '@/hooks/useLocalization';

import {IClassSchedule} from '@/types/classSchedule';
import {Status} from '@/types/common';

import {useCreateClassScheduleDetailsConfig} from './classScheduleConfig';

interface ClassScheduleDetailsDrawerProps {
  classScheduleId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (classScheduleId: number) => void;
}

const ClassScheduleDetailsDrawer: React.FC<ClassScheduleDetailsDrawerProps> = ({
  classScheduleId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedClassSchedule, loadClassSchedule, detailsStatus } = useClassSchedules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });
  useEffect(() => {
    if (visible && classScheduleId) {
      //getClassScheduleById(classScheduleId);
      loadClassSchedule(classScheduleId);
    }
  }, [visible, classScheduleId, loadClassSchedule]);

  const handleEdit = (classSchedule: IClassSchedule) => {
    onEdit(classSchedule.id);
  };

  const config = useCreateClassScheduleDetailsConfig(
    selectedClassSchedule,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={classScheduleId} // Force remount when classScheduleId changes
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

export default ClassScheduleDetailsDrawer;
