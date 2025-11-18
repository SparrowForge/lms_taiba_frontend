'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useExamCandidates } from '@/hooks/useExamCandidates';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamCandidate } from '@/types/examCandidate';

import { useCreateExamCandidateDetailsConfig } from './examCandidateConfig';

interface ExamCandidateDetailsDrawerProps {
  examCandidateId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (examCandidateId: number) => void;
}

const ExamCandidateDetailsDrawer: React.FC<ExamCandidateDetailsDrawerProps> = ({
  examCandidateId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedExamCandidate, loadExamCandidate, detailsStatus } = useExamCandidates();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_CANDIDATE, { defaultValue: 'Exam Candidate' });
  useEffect(() => {
    if (visible && examCandidateId) {
      //getExamCandidateById(examCandidateId);
      loadExamCandidate(examCandidateId);
    }
  }, [visible, examCandidateId, loadExamCandidate]);

  const handleEdit = (examCandidate: IExamCandidate) => {
    onEdit(examCandidate.id);
  };

  const config = useCreateExamCandidateDetailsConfig(
    selectedExamCandidate,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={examCandidateId} // Force remount when examCandidateId changes
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

export default ExamCandidateDetailsDrawer;
