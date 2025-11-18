'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useExamTypes } from '@/hooks/useExamTypes';
import { useLocalization } from '@/hooks/useLocalization';

import ExamTypeForm from './ExamTypeForm';

interface ExamTypeFormDrawerProps {
  mode: 'create' | 'edit';
  examTypeId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExamTypeFormDrawer: React.FC<ExamTypeFormDrawerProps> = ({
  mode,
  examTypeId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getExamTypeById, selectedExamType, loadExamType, detailsStatus } = useExamTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_TYPE, { defaultValue: 'Exam Type' });
  useEffect(() => {
    if (visible && mode === 'edit' && examTypeId) {
      //getExamTypeById(examTypeId);
      loadExamType(examTypeId);
    }
  }, [visible, mode, examTypeId, loadExamType]);

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
      key={examTypeId} // Force remount when examTypeId changes
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
      <ExamTypeForm
        mode={mode}
        examTypeId={examTypeId}
        initialValues={selectedExamType || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default ExamTypeFormDrawer;
