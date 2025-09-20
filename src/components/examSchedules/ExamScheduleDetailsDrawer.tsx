'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useExamSchedules } from '@/hooks/useExamSchedules';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamSchedule } from '@/types/examSchedule';

import { useCreateExamScheduleDetailsConfig } from './examScheduleConfig';

interface ExamScheduleDetailsDrawerProps {
  examScheduleId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (examScheduleId: number) => void;
}

const ExamScheduleDetailsDrawer: React.FC<ExamScheduleDetailsDrawerProps> = ({
  examScheduleId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedExamSchedule, loadExamSchedule, detailsStatus } = useExamSchedules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SCHEDULE, { defaultValue: 'Exam Schedule' });
  useEffect(() => {
    if (visible && examScheduleId) {
      //getExamScheduleById(examScheduleId);
      loadExamSchedule(examScheduleId);
    }
  }, [visible, examScheduleId, loadExamSchedule]);

  const handleEdit = (examSchedule: IExamSchedule) => {
    onEdit(examSchedule.id);
  };

  const config = useCreateExamScheduleDetailsConfig(
    selectedExamSchedule,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={examScheduleId} // Force remount when examScheduleId changes
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

export default ExamScheduleDetailsDrawer;
