'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useStudentProfiles } from '@/hooks/useStudentProfiles';

import StudentProfileForm from './StudentProfileForm';

interface StudentProfileFormDrawerProps {
  mode: 'create' | 'edit';
  studentProfileId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const StudentProfileFormDrawer: React.FC<StudentProfileFormDrawerProps> = ({
  mode,
  studentProfileId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getStudentProfileById, selectedStudentProfile, loadStudentProfile, detailsStatus } =
    useStudentProfiles();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_PROFILE, { defaultValue: 'Student Profile' });

  useEffect(() => {
    if (visible && mode === 'edit' && studentProfileId) {
      //getStudentProfileById(studentProfileId);
      loadStudentProfile(studentProfileId);
    }
  }, [visible, mode, studentProfileId, loadStudentProfile]);

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
      key={studentProfileId} // Force remount when studentProfileId changes
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
      <StudentProfileForm
        mode={mode}
        studentProfileId={studentProfileId}
        initialValues={selectedStudentProfile || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default StudentProfileFormDrawer;
