'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' });
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
      key={semesterId} // Force remount when semesterId changes
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
