'use client';

import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {ISemesterSubject} from '@/types/semesterSubject';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';
import {useCreateSemesterSubjectDetailsConfig} from './semesterSubjectConfig';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

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
  const [semesterSubject, setSemesterSubject] = useState<ISemesterSubject | null>(null);
  const { semesterSubjects, getSemesterSubjectById, loadSemesterSubject, detailsStatus } = useSemesterSubjects();
  const t = useTranslations();
  const entityName = t('semesterSubject', { defaultValue: 'Semester Subject' });
  useEffect(() => {
    if (visible && semesterSubjectId) {
      // Try to get from current list first
      const existingSemesterSubject = getSemesterSubjectById(semesterSubjectId);
      if (existingSemesterSubject) {
        setSemesterSubject(existingSemesterSubject);
      } else {
        // Load from API if not in current list
        loadSemesterSubject(semesterSubjectId);
      }
    } else {
      setSemesterSubject(null);
    }
  }, [visible, semesterSubjectId, getSemesterSubjectById, loadSemesterSubject]);

  // Update semester subject when semester subjects list changes
  useEffect(() => {
    if (semesterSubjectId && semesterSubjects.length > 0) {
      const foundSemesterSubject = getSemesterSubjectById(semesterSubjectId);
      if (foundSemesterSubject) {
        setSemesterSubject(foundSemesterSubject);
      }
    }
  }, [semesterSubjects, semesterSubjectId, getSemesterSubjectById]);

  const handleEdit = (semesterSubject: ISemesterSubject) => {
    onEdit(semesterSubject.id);
  };

  const config = useCreateSemesterSubjectDetailsConfig(
    semesterSubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    }
  );

  return (
    <Drawer
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