'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

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
  const { getSemesterSubjectById, selectedSemesterSubject } = useSemesterSubjects();
  const t = useTranslations();
  const entityName = t('semesterSubject', { defaultValue: 'Semester Subject' });
  useEffect(() => {
    if (visible && mode === 'edit' && semesterSubjectId) {
      getSemesterSubjectById(semesterSubjectId);
    }
  }, [visible, mode, semesterSubjectId, getSemesterSubjectById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
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
        initialValues={selectedSemesterSubject || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SemesterSubjectFormDrawer;
