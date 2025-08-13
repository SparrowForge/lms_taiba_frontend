'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useFaculties} from '@/hooks/useFaculties';

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
 
  const { getFacultyById, selectedFaculty } = useFaculties();
  const t = useTranslations();
  const entityName = t('faculty', { defaultValue: 'Faculty' });
  useEffect(() => {
    if (visible && mode === 'edit' && facultyId) {
      getFacultyById(facultyId);
    }
  }, [visible, mode, facultyId, getFacultyById]);

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
      <FacultyForm
        mode={mode}
        facultyId={facultyId}
        initialValues={selectedFaculty || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default FacultyFormDrawer;
