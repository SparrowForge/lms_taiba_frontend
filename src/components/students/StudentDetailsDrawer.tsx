'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudents} from '@/hooks/useStudents';

import {Status} from '@/types/common';
import {IStudent} from '@/types/student';

import {useCreateStudentDetailsConfig} from './studentConfig';


interface StudentDetailsDrawerProps {
  studentId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (studentId: number) => void;
}

const StudentDetailsDrawer: React.FC<StudentDetailsDrawerProps> = ({
  studentId,
  visible,
  onClose,
  onEdit,
}) => {

  const { selectedStudent, loadStudent, detailsStatus } = useStudents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });

  useEffect(() => {
    if (visible && studentId) {
      //getStudentById(studentId);
      loadStudent(studentId);
    }
  }, [visible, studentId, loadStudent]);

  const handleEdit = (student: IStudent) => {
    onEdit(student.id);
  };

  const config = useCreateStudentDetailsConfig(
    selectedStudent,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={studentId} // Force remount when studentId changes
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

export default StudentDetailsDrawer;
