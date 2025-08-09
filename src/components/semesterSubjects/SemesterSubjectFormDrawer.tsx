'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

import {ISemesterSubject} from '@/types/semesterSubject';

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
  const [initialValues, setInitialValues] = useState<Partial<ISemesterSubject> | undefined>();
  const { semesterSubjects, getSemesterSubjectById, loadSemesterSubject } = useSemesterSubjects();
  const t = useTranslations();
  const entityName = t('semesterSubject', { defaultValue: 'Semester Subject' });
  useEffect(() => {
    if (visible && mode === 'edit' && semesterSubjectId) {
      // Try to get from current list first
      const existingSemesterSubject = getSemesterSubjectById(semesterSubjectId);
      if (existingSemesterSubject) {
        setInitialValues(existingSemesterSubject);
      } else {
        // Load from API if not in current list
        loadSemesterSubject(semesterSubjectId);
      }
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, semesterSubjectId, getSemesterSubjectById, loadSemesterSubject]);

  // Update initial values when semester subjects list changes
  useEffect(() => {
    if (mode === 'edit' && semesterSubjectId && semesterSubjects.length > 0) {
      const semesterSubject = getSemesterSubjectById(semesterSubjectId);
      if (semesterSubject) {
        setInitialValues(semesterSubject);
      }
    }
  }, [semesterSubjects, semesterSubjectId, mode, getSemesterSubjectById]);

  const handleSuccess = () => {
    onSuccess();
    setInitialValues(undefined);
  };

  const handleCancel = () => {
    onCancel();
    setInitialValues(undefined);
  };

  return (
    <Drawer
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <SemesterSubjectForm
        mode={mode}
        semesterSubjectId={semesterSubjectId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SemesterSubjectFormDrawer;
