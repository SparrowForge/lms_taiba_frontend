'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';
import { UserType } from '@/enums/user-type.enum';

import { useAuth } from '@/hooks/useAuth';
import { useCourseMaterials } from '@/hooks/useCourseMaterials';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourseMaterial } from '@/types/courseMaterial';

import CourseMaterialForm from './CourseMaterialForm';
import CourseMaterialFacultyForm from '../dashboard/course/CourseMaterialFormFaculty';

interface CourseMaterialFormDrawerProps {
  mode: 'create' | 'edit';
  courseMaterialId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  classNo?: number
}

const CourseMaterialFormDrawer: React.FC<CourseMaterialFormDrawerProps> = ({
  mode,
  courseMaterialId,
  visible,
  onCancel,
  onSuccess,
  classNo
}) => {
  const { user } = useAuth()
  const { t } = useLocalization();
  const { selectedCourseMaterial, loadCourseMaterial, detailsStatus } =
    useCourseMaterials();
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

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
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
      {
        user?.type === UserType.FACULTY ? <CourseMaterialFacultyForm
          mode={mode}
          courseMaterialId={courseMaterialId}
          initialValues={convertToFormValues(selectedCourseMaterial)}
          onSuccess={onSuccess}
          onCancel={onCancel}
          embedded={true}
          classNo={classNo}
        /> : <CourseMaterialForm
          mode={mode}
          courseMaterialId={courseMaterialId}
          initialValues={convertToFormValues(selectedCourseMaterial)}
          onSuccess={onSuccess}
          onCancel={onCancel}
          embedded={true}
        />
      }
    </Drawer>
  );
};

export default CourseMaterialFormDrawer;
