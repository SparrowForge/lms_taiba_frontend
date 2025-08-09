'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useFaculties} from '@/hooks/useFaculties';

import {IFaculty} from '@/types/faculty';

import FacultyForm from './FacultyForm';


interface FacultyFormDrawerProps {
  mode: 'create' | 'edit';
  facultyId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const FacultyFormDrawer: React.FC<FacultyFormDrawerProps> = ({
  mode,
  facultyId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<IFaculty> | undefined>();
  const { faculties, getFacultyById, loadFaculty } = useFaculties();
  const t = useTranslations();
  const entityName = t('faculty', { defaultValue: 'Faculty' });
  useEffect(() => {
    if (visible && mode === 'edit' && facultyId) {
      // Try to get from current list first
      const existingFaculty = getFacultyById(facultyId);
      if (existingFaculty) {
        setInitialValues(existingFaculty);
      } else {
        // Load from API if not in current list
        loadFaculty(facultyId);
      }
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, facultyId, getFacultyById, loadFaculty]);

  // Update initial values when faculties list changes
  useEffect(() => {
    if (mode === 'edit' && facultyId && faculties.length > 0) {
      const faculty = getFacultyById(facultyId);
      if (faculty) {
        setInitialValues(faculty);
      }
    }
  }, [faculties, facultyId, mode, getFacultyById]);

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
      <FacultyForm
        mode={mode}
        facultyId={facultyId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default FacultyFormDrawer;
