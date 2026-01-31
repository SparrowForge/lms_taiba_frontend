'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useExamQuestions } from '@/hooks/useExamQuestions';
import { useLocalization } from '@/hooks/useLocalization';

import ExamQuestionForm from './ExamQuestionForm';

interface ExamQuestionFormDrawerProps {
  mode: 'create' | 'edit';
  examQuestionId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExamQuestionFormDrawer: React.FC<ExamQuestionFormDrawerProps> = ({
  mode,
  examQuestionId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedExamQuestion, loadExamQuestion, detailsStatus } = useExamQuestions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_QUESTION, { defaultValue: 'Exam Question' });

  useEffect(() => {
    if (visible && mode === 'edit' && examQuestionId) {
      loadExamQuestion(examQuestionId);
    }
  }, [visible, mode, examQuestionId, loadExamQuestion]);

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
      key={examQuestionId}
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
      width={800}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <ExamQuestionForm
        mode={mode}
        examQuestionId={examQuestionId}
        initialValues={selectedExamQuestion || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default ExamQuestionFormDrawer;
