'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' });
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

export default SemesterDetailsDrawer;
