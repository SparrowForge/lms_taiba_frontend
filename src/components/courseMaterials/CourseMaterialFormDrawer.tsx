'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useCourseMaterials} from '@/hooks/useCourseMaterials';
import {useLocalization} from '@/hooks/useLocalization';


import { Status } from '@/types/common';
import {ICourseMaterial} from '@/types/courseMaterial';

import CourseMaterialForm from './CourseMaterialForm';

interface CourseMaterialFormDrawerProps {
  mode: 'create' | 'edit';
  courseMaterialId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const CourseMaterialFormDrawer: React.FC<CourseMaterialFormDrawerProps> = ({
  mode,
  courseMaterialId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { t } = useLocalization();
  const { selectedCourseMaterial, getCourseMaterialById, loadCourseMaterial, detailsStatus } = useCourseMaterials();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });

  useEffect(() => {
    if (visible && mode === 'edit' && courseMaterialId) {
      //getCourseMaterialById(courseMaterialId);
      loadCourseMaterial(courseMaterialId);
    }
  }, [visible, mode, courseMaterialId, loadCourseMaterial]);

  const getTitle = () => {
    if (mode === 'create') {
      return t(LOCALE_KEYS.CREATE_NAME, { name: entityName });
    }
    return t(LOCALE_KEYS.EDIT_NAME, { name: entityName });
  };

  // Convert ICourseMaterial to form-compatible type (null -> undefined)
  const convertToFormValues = (courseMaterial: ICourseMaterial | null) => {
    if (!courseMaterial) return undefined;

    return {
      ...courseMaterial,
      fileId: courseMaterial.fileId ?? undefined,
    };
  };

  if( mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin/>;
  }

  return (
    <Drawer
      key={courseMaterialId} // Force remount when courseMaterialId changes
      title={getTitle()}
      width={600}
      open={visible}
      onClose={onCancel}
      destroyOnHidden={true}
    >
      <CourseMaterialForm
        mode={mode}
        courseMaterialId={courseMaterialId}
        initialValues={convertToFormValues(selectedCourseMaterial)}
        onSuccess={onSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default CourseMaterialFormDrawer;
