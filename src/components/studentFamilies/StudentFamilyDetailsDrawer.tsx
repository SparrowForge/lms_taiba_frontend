'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentFamilies} from '@/hooks/useStudentFamilies';

import {Status} from '@/types/common';
import {IStudentFamily} from '@/types/studentFamily';

import {useCreateStudentFamilyDetailsConfig} from './studentFamilyConfig';

interface StudentFamilyDetailsDrawerProps {
  studentFamilyId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (studentFamilyId: number) => void;
}

const StudentFamilyDetailsDrawer: React.FC<StudentFamilyDetailsDrawerProps> = ({
  studentFamilyId,
  visible,
  onClose,
  onEdit,
}) => {
  const { getStudentFamilyById, selectedStudentFamily, detailsStatus } = useStudentFamilies();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_FAMILY, { defaultValue: 'Student Family' });

  useEffect(() => {
    if (visible && studentFamilyId) {
      getStudentFamilyById(studentFamilyId);
    }
  }, [visible, studentFamilyId, getStudentFamilyById]);

  const handleEdit = (studentFamily: IStudentFamily) => {
    onEdit(studentFamily.id);
  };

  const config = useCreateStudentFamilyDetailsConfig(
    selectedStudentFamily,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={studentFamilyId} // Force remount when studentFamilyId changes
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

export default StudentFamilyDetailsDrawer;
