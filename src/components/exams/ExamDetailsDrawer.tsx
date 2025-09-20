'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';

import { IExam } from '@/types/exam';

import { useCreateExamDetailsConfig } from './examConfig';

interface ExamDetailsDrawerProps {
  examId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (examId: number) => void;
}

const ExamDetailsDrawer: React.FC<ExamDetailsDrawerProps> = ({
  examId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedExam, loadExam, detailsStatus } = useExams();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });
  useEffect(() => {
    if (visible && examId) {
      //getExamById(examId);
      loadExam(examId);
    }
  }, [visible, examId, loadExam]);

  const handleEdit = (exam: IExam) => {
    onEdit(exam.id);
  };

  const config = useCreateExamDetailsConfig(
    selectedExam,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={examId} // Force remount when examId changes
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

export default ExamDetailsDrawer;
