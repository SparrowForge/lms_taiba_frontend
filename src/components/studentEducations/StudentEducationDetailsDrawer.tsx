'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentEducations} from '@/hooks/useStudentEducations';

import {Status} from '@/types/common';
import {IStudentEducation} from '@/types/studentEducation';

import {useCreateStudentEducationDetailsConfig} from './studentEducationConfig';

interface StudentEducationDetailsDrawerProps {
  studentEducationId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (studentEducationId: number) => void;
}

const StudentEducationDetailsDrawer: React.FC<StudentEducationDetailsDrawerProps> = ({
  studentEducationId,
  visible,
  onClose,
  onEdit,
}) => {
  const { loadStudentEducation, selectedStudentEducation, detailsStatus } = useStudentEducations();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_EDUCATION, { defaultValue: 'Student Education' });

  useEffect(() => {
    if (visible && studentEducationId) {
      //getStudentEducationById(studentEducationId);
      loadStudentEducation(studentEducationId);
    }
  }, [visible, studentEducationId, loadStudentEducation]);

  const handleEdit = (studentEducation: IStudentEducation) => {
    onEdit(studentEducation.id);
  };

  const config = useCreateStudentEducationDetailsConfig(
    selectedStudentEducation,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={studentEducationId} // Force remount when studentEducationId changes
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

export default StudentEducationDetailsDrawer;
