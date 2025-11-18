'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useExamSchedules } from '@/hooks/useExamSchedules';
import { useLocalization } from '@/hooks/useLocalization';

import ExamScheduleForm from './ExamScheduleForm';

interface ExamScheduleFormDrawerProps {
  mode: 'create' | 'edit';
  examScheduleId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExamScheduleFormDrawer: React.FC<ExamScheduleFormDrawerProps> = ({
  mode,
  examScheduleId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getExamScheduleById, selectedExamSchedule, loadExamSchedule, detailsStatus } =
    useExamSchedules();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SCHEDULE, { defaultValue: 'Exam Schedule' });
  useEffect(() => {
    if (visible && mode === 'edit' && examScheduleId) {
      //getExamScheduleById(examScheduleId);
      loadExamSchedule(examScheduleId);
    }
  }, [visible, mode, examScheduleId, loadExamSchedule]);

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
      key={examScheduleId} // Force remount when examScheduleId changes
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
      <ExamScheduleForm
        mode={mode}
        examScheduleId={examScheduleId}
        initialValues={selectedExamSchedule || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default ExamScheduleFormDrawer;
