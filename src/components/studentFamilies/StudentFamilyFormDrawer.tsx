'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentFamilies} from '@/hooks/useStudentFamilies';

import StudentFamilyForm from './StudentFamilyForm';

interface StudentFamilyFormDrawerProps {
  mode: 'create' | 'edit';
  studentFamilyId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const StudentFamilyFormDrawer: React.FC<StudentFamilyFormDrawerProps> = ({
  mode,
  studentFamilyId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getStudentFamilyById, selectedStudentFamily, loadStudentFamily, detailsStatus } =
    useStudentFamilies();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_FAMILY, { defaultValue: 'Student Family' });

  useEffect(() => {
    if (visible && mode === 'edit' && studentFamilyId) {
      //getStudentFamilyById(studentFamilyId);
      loadStudentFamily(studentFamilyId);
    }
  }, [visible, mode, studentFamilyId, loadStudentFamily]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={studentFamilyId} // Force remount when studentFamilyId changes
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
      <StudentFamilyForm
        mode={mode}
        studentFamilyId={studentFamilyId}
        initialValues={selectedStudentFamily || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default StudentFamilyFormDrawer;
