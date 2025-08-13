'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';


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
  const t = useTranslations();
  const entityName = t('facultySubject');
  const { selectedFacultySubject, getFacultySubjectById } = useFacultySubjects();

  useEffect(() => {
    if (visible && mode === 'edit' && facultySubjectId) {
      getFacultySubjectById(facultySubjectId);
    }
  }, [visible, mode, facultySubjectId, getFacultySubjectById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={facultySubjectId} // Force remount when facultySubjectId changes
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
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
