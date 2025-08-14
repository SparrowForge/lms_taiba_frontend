'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentEducations} from '@/hooks/useStudentEducations';

import StudentEducationForm from './StudentEducationForm';

interface StudentEducationFormDrawerProps {
  mode: 'create' | 'edit';
  studentEducationId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const StudentEducationFormDrawer: React.FC<StudentEducationFormDrawerProps> = ({
  mode,
  studentEducationId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getStudentEducationById, selectedStudentEducation } = useStudentEducations();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_EDUCATION, { defaultValue: 'Student Education' });

  useEffect(() => {
    if (visible && mode === 'edit' && studentEducationId) {
      getStudentEducationById(studentEducationId);
    }
  }, [visible, mode, studentEducationId, getStudentEducationById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={studentEducationId} // Force remount when studentEducationId changes
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
      <StudentEducationForm
        mode={mode}
        studentEducationId={studentEducationId}
        initialValues={selectedStudentEducation || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default StudentEducationFormDrawer;
