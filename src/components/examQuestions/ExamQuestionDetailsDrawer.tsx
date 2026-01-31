'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useExamQuestions } from '@/hooks/useExamQuestions';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamQuestion } from '@/types/examQuestion';

import { useCreateExamQuestionDetailsConfig } from './examQuestionConfig';

interface ExamQuestionDetailsDrawerProps {
  examQuestionId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (examQuestionId: number) => void;
}

const ExamQuestionDetailsDrawer: React.FC<ExamQuestionDetailsDrawerProps> = ({
  examQuestionId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedExamQuestion, loadExamQuestion, detailsStatus } = useExamQuestions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_QUESTION, { defaultValue: 'Exam Question' });

  useEffect(() => {
    if (visible && examQuestionId) {
      loadExamQuestion(examQuestionId);
    }
  }, [visible, examQuestionId, loadExamQuestion]);

  const handleEdit = (question: IExamQuestion) => {
    onEdit(question.id);
  };

  const config = useCreateExamQuestionDetailsConfig(
    selectedExamQuestion,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={examQuestionId}
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

export default ExamQuestionDetailsDrawer;
