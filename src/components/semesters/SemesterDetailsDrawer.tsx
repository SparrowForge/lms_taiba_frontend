'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

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
  
  const { selectedSemester, getSemesterById, detailsStatus } = useSemesters();
  const t = useTranslations();
  const entityName = t('semester', { defaultValue: 'Semester' });
  useEffect(() => {
    if (visible && semesterId) {
      getSemesterById(semesterId);
    }
  }, [visible, semesterId, getSemesterById]);

  const handleEdit = (semester: ISemester) => {
    onEdit(semester.id);
  };

  const config = useCreateSemesterDetailsConfig(
    selectedSemester,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={semesterId} // Force remount when semesterId changes
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
