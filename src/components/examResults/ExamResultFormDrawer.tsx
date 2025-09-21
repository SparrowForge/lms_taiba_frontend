'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useExamResults } from '@/hooks/useExamResults';
import { useLocalization } from '@/hooks/useLocalization';

import ExamResultForm from './ExamResultForm';

interface ExamResultFormDrawerProps {
  mode: 'create' | 'edit';
  examResultId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExamResultFormDrawer: React.FC<ExamResultFormDrawerProps> = ({
  mode,
  examResultId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedExamResult, loadExamResult, detailsStatus } = useExamResults();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_RESULT, { defaultValue: 'Exam Result' });
  useEffect(() => {
    if (visible && mode === 'edit' && examResultId) {
      loadExamResult(examResultId);
    }
  }, [visible, mode, examResultId, loadExamResult]);

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
      key={examResultId} // Force remount when examResultId changes
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
      <ExamResultForm
        mode={mode}
        examResultId={examResultId}
        initialValues={selectedExamResult || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default ExamResultFormDrawer;
