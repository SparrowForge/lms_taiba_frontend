'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useStudentProfiles} from '@/hooks/useStudentProfiles';

import {Status} from '@/types/common';
import {IStudentProfile} from '@/types/studentProfile';

import {useCreateStudentProfileDetailsConfig} from './studentProfileConfig';

interface StudentProfileDetailsDrawerProps {
  studentProfileId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (studentProfileId: number) => void;
}

const StudentProfileDetailsDrawer: React.FC<StudentProfileDetailsDrawerProps> = ({
  studentProfileId,
  visible,
  onClose,
  onEdit,
}) => {
  const { loadStudentProfile, selectedStudentProfile, detailsStatus } = useStudentProfiles();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_PROFILE, { defaultValue: 'Student Profile' });

  useEffect(() => {
    if (visible && studentProfileId) {
      //getStudentProfileById(studentProfileId);
      loadStudentProfile(studentProfileId);
    }
  }, [visible, studentProfileId, loadStudentProfile]);

  const handleEdit = (studentProfile: IStudentProfile) => {
    onEdit(studentProfile.id);
  };

  const config = useCreateStudentProfileDetailsConfig(
    selectedStudentProfile,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={studentProfileId} // Force remount when studentProfileId changes
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

export default StudentProfileDetailsDrawer;
