'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudents} from '@/hooks/useStudents';

import StudentForm from './StudentForm';


interface StudentFormDrawerProps {
  mode: 'create' | 'edit';
  studentId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const StudentFormDrawer: React.FC<StudentFormDrawerProps> = ({
  mode,
  studentId,
  visible,
  onCancel,
  onSuccess,
}) => {

  const { getStudentById, selectedStudent } = useStudents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });
  useEffect(() => {
    if (visible && mode === 'edit' && studentId) {
      getStudentById(studentId);
    }
  }, [visible, mode, studentId, getStudentById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={studentId} // Force remount when studentId changes
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <StudentForm
        mode={mode}
        studentId={studentId}
        initialValues={selectedStudent || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default StudentFormDrawer;
