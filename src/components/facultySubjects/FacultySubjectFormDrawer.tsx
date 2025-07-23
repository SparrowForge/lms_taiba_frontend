'use client';

import React, {useEffect} from 'react';
import {Drawer} from 'antd';
import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {IFacultySubject, IFacultySubjectCreate, IFacultySubjectUpdate} from '@/types/facultySubject';
import {useTranslations} from 'next-intl';
import FacultySubjectForm from './FacultySubjectForm';

interface FacultySubjectFormDrawerProps {
  open: boolean;
  mode: 'create' | 'edit';
  facultySubjectId?: number;
  initialValues?: Partial<IFacultySubjectCreate | IFacultySubjectUpdate>;
  onClose: () => void;
  onSuccess?: (facultySubject?: IFacultySubject) => void;
}

const FacultySubjectFormDrawer: React.FC<FacultySubjectFormDrawerProps> = ({
  open,
  mode,
  facultySubjectId,
  initialValues,
  onClose,
  onSuccess
}) => {
  const t = useTranslations();
  const entityName = t('facultySubject');
  const { createFacultySubject, editFacultySubject, actionStatus, clearAction } = useFacultySubjects();

  useEffect(() => {
    if (!open) {
      clearAction();
    }
  }, [open, clearAction]);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const getTitle = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  return (
    <Drawer
      title={getTitle()}
      width={720}
      open={open}
      onClose={handleCancel}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
    >
      <FacultySubjectForm
        mode={mode}
        facultySubjectId={facultySubjectId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default FacultySubjectFormDrawer;
