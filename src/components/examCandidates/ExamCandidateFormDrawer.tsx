'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useExamCandidates } from '@/hooks/useExamCandidates';
import { useLocalization } from '@/hooks/useLocalization';

import ExamCandidateForm from './ExamCandidateForm';

interface ExamCandidateFormDrawerProps {
  mode: 'create' | 'edit';
  examCandidateId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ExamCandidateFormDrawer: React.FC<ExamCandidateFormDrawerProps> = ({
  mode,
  examCandidateId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedExamCandidate, loadExamCandidate, detailsStatus } =
    useExamCandidates();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_CANDIDATE, { defaultValue: 'Exam Candidate' });
  useEffect(() => {
    if (visible && mode === 'edit' && examCandidateId) {
      loadExamCandidate(examCandidateId);
    }
  }, [visible, mode, examCandidateId, loadExamCandidate]);

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
      key={examCandidateId} // Force remount when examCandidateId changes
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
      <ExamCandidateForm
        mode={mode}
        examCandidateId={examCandidateId}
        initialValues={selectedExamCandidate || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default ExamCandidateFormDrawer;
