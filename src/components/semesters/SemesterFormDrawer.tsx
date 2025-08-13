'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useSemesters} from '@/hooks/useSemesters';

import SemesterForm from './SemesterForm';


interface SemesterFormDrawerProps {
  mode: 'create' | 'edit';
  semesterId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const SemesterFormDrawer: React.FC<SemesterFormDrawerProps> = ({
  mode,
  semesterId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getSemesterById, selectedSemester } = useSemesters();
  const t = useTranslations();
  const entityName = t('semester', { defaultValue: 'Semester' });
  useEffect(() => {
    if (visible && mode === 'edit' && semesterId) {
      getSemesterById(semesterId);
    }
  }, [visible, mode, semesterId, getSemesterById]);

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
      <SemesterForm
        mode={mode}
        semesterId={semesterId}
        initialValues={selectedSemester || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SemesterFormDrawer;
