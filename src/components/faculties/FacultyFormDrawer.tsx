'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';

import { Status } from '@/types/common';

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

  const { getFacultyById, selectedFaculty, loadFaculty, detailsStatus } = useFaculties();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY, { defaultValue: 'Faculty' });
  useEffect(() => {
    if (visible && mode === 'edit' && facultyId) {
      //getFacultyById(facultyId);
      loadFaculty(facultyId);
    }
  }, [visible, mode, facultyId, loadFaculty]);

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
      key={facultyId} // Force remount when facultyId changes
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
