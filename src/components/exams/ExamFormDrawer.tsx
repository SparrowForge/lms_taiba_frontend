'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';

import ExamForm from './ExamForm';

interface ExamFormDrawerProps {
  mode: 'create' | 'edit';
  examId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExamFormDrawer: React.FC<ExamFormDrawerProps> = ({
  mode,
  examId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getExamById, selectedExam, loadExam, detailsStatus } = useExams();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });
  useEffect(() => {
    if (visible && mode === 'edit' && examId) {
      //getExamById(examId);
      loadExam(examId);
    }
  }, [visible, mode, examId, loadExam]);

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
      key={examId} // Force remount when examId changes
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
      <ExamForm
        mode={mode}
        examId={examId}
        initialValues={selectedExam || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default ExamFormDrawer;
