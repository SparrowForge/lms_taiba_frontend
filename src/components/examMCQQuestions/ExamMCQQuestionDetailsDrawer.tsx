'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useExamMCQQuestions } from '@/hooks/useExamMCQQuestions';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamMCQQuestion } from '@/types/examMCQQuestion';

import { useCreateExamMCQQuestionDetailsConfig } from './examMCQQuestionConfig';

interface ExamMCQQuestionDetailsDrawerProps {
  examMCQQuestionId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (examMCQQuestionId: number) => void;
}

const ExamMCQQuestionDetailsDrawer: React.FC<ExamMCQQuestionDetailsDrawerProps> = ({
  examMCQQuestionId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedExamMCQQuestion, loadExamMCQQuestion, detailsStatus } = useExamMCQQuestions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });
  useEffect(() => {
    if (visible && examMCQQuestionId) {
      //getExamMCQQuestionById(examMCQQuestionId);
      loadExamMCQQuestion(examMCQQuestionId);
    }
  }, [visible, examMCQQuestionId, loadExamMCQQuestion]);

  const handleEdit = (examMCQQuestion: IExamMCQQuestion) => {
    onEdit(examMCQQuestion.id);
  };

  const config = useCreateExamMCQQuestionDetailsConfig(
    selectedExamMCQQuestion,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={examMCQQuestionId} // Force remount when examMCQQuestionId changes
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

export default ExamMCQQuestionDetailsDrawer;
