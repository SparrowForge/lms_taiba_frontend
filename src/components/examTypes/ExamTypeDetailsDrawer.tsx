'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useExamTypes } from '@/hooks/useExamTypes';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamType } from '@/types/examType';

import { useCreateExamTypeDetailsConfig } from './examTypeConfig';

interface ExamTypeDetailsDrawerProps {
  examTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (examTypeId: number) => void;
}

const ExamTypeDetailsDrawer: React.FC<ExamTypeDetailsDrawerProps> = ({
  examTypeId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedExamType, loadExamType, detailsStatus } = useExamTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_TYPE, { defaultValue: 'Exam Type' });
  useEffect(() => {
    if (visible && examTypeId) {
      //getExamTypeById(examTypeId);
      loadExamType(examTypeId);
    }
  }, [visible, examTypeId, loadExamType]);

  const handleEdit = (examType: IExamType) => {
    onEdit(examType.id);
  };

  const config = useCreateExamTypeDetailsConfig(
    selectedExamType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={examTypeId} // Force remount when examTypeId changes
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

export default ExamTypeDetailsDrawer;
