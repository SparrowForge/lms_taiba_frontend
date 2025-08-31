'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {useLocalization} from '@/hooks/useLocalization';

import { Status } from '@/types/common';

import FacultySubjectForm from './FacultySubjectForm';

interface FacultySubjectFormDrawerProps {
  visible: boolean;
  mode: 'create' | 'edit';
  facultySubjectId?: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const FacultySubjectFormDrawer: React.FC<FacultySubjectFormDrawerProps> = ({
  visible,
  mode,
  facultySubjectId,
  onCancel,
  onSuccess,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY_SUBJECT, { defaultValue: 'Faculty Subject' });
  const { selectedFacultySubject, getFacultySubjectById, loadFacultySubject, detailsStatus } = useFacultySubjects();

  useEffect(() => {
    if (visible && mode === 'edit' && facultySubjectId) {
      //getFacultySubjectById(facultySubjectId);
      loadFacultySubject(facultySubjectId);
    }
  }, [visible, mode, facultySubjectId, loadFacultySubject]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if( mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin/>;
  }

  return (
    <Drawer
      key={facultySubjectId} // Force remount when facultySubjectId changes
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
      width={720}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
      maskClosable={false}
      keyboard={false}
    >
      <FacultySubjectForm
        mode={mode}
        facultySubjectId={facultySubjectId}
        initialValues={selectedFacultySubject || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default FacultySubjectFormDrawer;
