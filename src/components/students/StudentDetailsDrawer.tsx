'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

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
  
  const { selectedStudent, getStudentById, detailsStatus } = useStudents();
  const t = useTranslations();
  const entityName = t('student', { defaultValue: 'Student' });
  
  useEffect(() => {
    if (visible && studentId) {
      getStudentById(studentId);
    }
  }, [visible, studentId, getStudentById]);

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

export default StudentDetailsDrawer;
