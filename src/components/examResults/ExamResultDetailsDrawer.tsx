'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useExamResults } from '@/hooks/useExamResults';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamResult } from '@/types/examResult';

import { useCreateExamResultDetailsConfig } from './examResultConfig';

interface ExamResultDetailsDrawerProps {
  examResultId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (examResultId: number) => void;
}

const ExamResultDetailsDrawer: React.FC<ExamResultDetailsDrawerProps> = ({
  examResultId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedExamResult, loadExamResult, detailsStatus } = useExamResults();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_RESULT, { defaultValue: 'Exam Result' });
  useEffect(() => {
    if (visible && examResultId) {
      //getExamResultById(examResultId);
      loadExamResult(examResultId);
    }
  }, [visible, examResultId, loadExamResult]);

  const handleEdit = (examResult: IExamResult) => {
    onEdit(examResult.id);
  };

  const config = useCreateExamResultDetailsConfig(
    selectedExamResult,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={examResultId} // Force remount when examResultId changes
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

export default ExamResultDetailsDrawer;
