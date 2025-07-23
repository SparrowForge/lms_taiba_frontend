'use client';

import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {ISemester} from '@/types/semester';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';
import {createSemesterDetailsConfig} from './semesterConfig';
import {useSemesters} from '@/hooks/useSemesters';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

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

  const config = createSemesterDetailsConfig(
    semester,
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

export default SemesterDetailsDrawer;
