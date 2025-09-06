'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

import {Status} from '@/types/common';
import {ISemesterSubject} from '@/types/semesterSubject';

import {useCreateSemesterSubjectDetailsConfig} from './semesterSubjectConfig';

interface SemesterSubjectDetailsDrawerProps {
  semesterSubjectId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (semesterSubjectId: number) => void;
}

const SemesterSubjectDetailsDrawer: React.FC<SemesterSubjectDetailsDrawerProps> = ({
  semesterSubjectId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedSemesterSubject, loadSemesterSubject, detailsStatus } = useSemesterSubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' });
  useEffect(() => {
    if (visible && semesterSubjectId) {
      //getSemesterSubjectById(semesterSubjectId);
      loadSemesterSubject(semesterSubjectId);
    }
  }, [visible, semesterSubjectId, loadSemesterSubject]);

  const handleEdit = (semesterSubject: ISemesterSubject) => {
    onEdit(semesterSubject.id);
  };

  const config = useCreateSemesterSubjectDetailsConfig(
    selectedSemesterSubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={semesterSubjectId} // Force remount when semesterSubjectId changes
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

export default SemesterSubjectDetailsDrawer;
