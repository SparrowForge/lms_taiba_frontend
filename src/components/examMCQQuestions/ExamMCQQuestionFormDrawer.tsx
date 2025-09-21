'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useExamMCQQuestions } from '@/hooks/useExamMCQQuestions';
import { useLocalization } from '@/hooks/useLocalization';

import ExamMCQQuestionForm from './ExamMCQQuestionForm';

interface ExamMCQQuestionFormDrawerProps {
  mode: 'create' | 'edit';
  examMCQQuestionId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExamMCQQuestionFormDrawer: React.FC<ExamMCQQuestionFormDrawerProps> = ({
  mode,
  examMCQQuestionId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedExamMCQQuestion, loadExamMCQQuestion, detailsStatus } =
    useExamMCQQuestions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });
  useEffect(() => {
    if (visible && mode === 'edit' && examMCQQuestionId) {
      loadExamMCQQuestion(examMCQQuestionId);
    }
  }, [visible, mode, examMCQQuestionId, loadExamMCQQuestion]);

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
      key={examMCQQuestionId} // Force remount when examMCQQuestionId changes
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
      <ExamMCQQuestionForm
        mode={mode}
        examMCQQuestionId={examMCQQuestionId}
        initialValues={selectedExamMCQQuestion || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default ExamMCQQuestionFormDrawer;
