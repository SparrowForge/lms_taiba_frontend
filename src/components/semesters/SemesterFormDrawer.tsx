'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useSemesters} from '@/hooks/useSemesters';

import {ISemester} from '@/types/semester';

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
  const [initialValues, setInitialValues] = useState<Partial<ISemester> | undefined>();
  const { semesters, getSemesterById, loadSemester } = useSemesters();
  const t = useTranslations();
  const entityName = t('semester', { defaultValue: 'Semester' });
  useEffect(() => {
    if (visible && mode === 'edit' && semesterId) {
      // Try to get from current list first
      const existingSemester = getSemesterById(semesterId);
      if (existingSemester) {
        setInitialValues(existingSemester);
      } else {
        // Load from API if not in current list
        loadSemester(semesterId);
      }
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, semesterId, getSemesterById, loadSemester]);

  // Update initial values when semesters list changes
  useEffect(() => {
    if (mode === 'edit' && semesterId && semesters.length > 0) {
      const semester = getSemesterById(semesterId);
      if (semester) {
        setInitialValues(semester);
      }
    }
  }, [semesters, semesterId, mode, getSemesterById]);

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
      <SemesterForm
        mode={mode}
        semesterId={semesterId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SemesterFormDrawer;
