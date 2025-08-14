'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentProfiles} from '@/hooks/useStudentProfiles';

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
  const { getStudentProfileById, selectedStudentProfile } = useStudentProfiles();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_PROFILE, { defaultValue: 'Student Profile' });

  useEffect(() => {
    if (visible && mode === 'edit' && studentProfileId) {
      getStudentProfileById(studentProfileId);
    }
  }, [visible, mode, studentProfileId, getStudentProfileById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

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
