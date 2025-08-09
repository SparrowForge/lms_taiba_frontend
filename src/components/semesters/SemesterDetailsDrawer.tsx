'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';


import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';


import {useSemesters} from '@/hooks/useSemesters';

import {Status} from '@/types/common';
import {ISemester} from '@/types/semester';

import {useCreateSemesterDetailsConfig} from './semesterConfig';


interface SemesterDetailsDrawerProps {
  semesterId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (semesterId: number) => void;
}

const SemesterDetailsDrawer: React.FC<SemesterDetailsDrawerProps> = ({
  semesterId,
  visible,
  onClose,
  onEdit,
}) => {
  const [semester, setSemester] = useState<ISemester | null>(null);
  const { semesters, getSemesterById, loadSemester, detailsStatus } = useSemesters();
  const t = useTranslations();
  const entityName = t('semester', { defaultValue: 'Semester' });
  useEffect(() => {
    if (visible && semesterId) {
      // Try to get from current list first
      const existingSemester = getSemesterById(semesterId);
      if (existingSemester) {
        setSemester(existingSemester);
      } else {
        // Load from API if not in current list
        loadSemester(semesterId);
      }
    } else {
      setSemester(null);
    }
  }, [visible, semesterId, getSemesterById, loadSemester]);

  // Update semester when semesters list changes
  useEffect(() => {
    if (semesterId && semesters.length > 0) {
      const foundSemester = getSemesterById(semesterId);
      if (foundSemester) {
        setSemester(foundSemester);
      }
    }
  }, [semesters, semesterId, getSemesterById]);

  const handleEdit = (semester: ISemester) => {
    onEdit(semester.id);
  };

  const config = useCreateSemesterDetailsConfig(
    semester,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
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

export default SemesterDetailsDrawer;
