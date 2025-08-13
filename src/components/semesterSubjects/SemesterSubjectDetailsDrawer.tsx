'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

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
  
  const { selectedSemesterSubject, getSemesterSubjectById, detailsStatus } = useSemesterSubjects();
  const t = useTranslations();
  const entityName = t('semesterSubject', { defaultValue: 'Semester Subject' });
  useEffect(() => {
    if (visible && semesterSubjectId) {
      getSemesterSubjectById(semesterSubjectId);
    }
  }, [visible, semesterSubjectId, getSemesterSubjectById]);

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
      title={t('details_name', { name: entityName })}
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
