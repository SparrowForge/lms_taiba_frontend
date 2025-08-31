'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

import { Status } from '@/types/common';

import SemesterSubjectForm from './SemesterSubjectForm';


interface SemesterSubjectFormDrawerProps {
  mode: 'create' | 'edit';
  semesterSubjectId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const SemesterSubjectFormDrawer: React.FC<SemesterSubjectFormDrawerProps> = ({
  mode,
  semesterSubjectId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getSemesterSubjectById, selectedSemesterSubject, loadSemesterSubject, detailsStatus } = useSemesterSubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' });
  useEffect(() => {
    if (visible && mode === 'edit' && semesterSubjectId) {
      //getSemesterSubjectById(semesterSubjectId);
      loadSemesterSubject(semesterSubjectId);
    }
  }, [visible, mode, semesterSubjectId, loadSemesterSubject]);

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
      <SemesterSubjectForm
        mode={mode}
        semesterSubjectId={semesterSubjectId}
        initialValues={selectedSemesterSubject || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SemesterSubjectFormDrawer;
