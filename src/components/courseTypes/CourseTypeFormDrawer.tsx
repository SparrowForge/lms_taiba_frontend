'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useCourseTypes } from '@/hooks/useCourseTypes';
import { useLocalization } from '@/hooks/useLocalization';

import CourseTypeForm from './CourseTypeForm';

interface Props {
  mode: 'create' | 'edit';
  courseTypeId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CourseTypeFormDrawer: React.FC<Props> = ({
  mode,
  courseTypeId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getCourseTypeById, selectedCourseType, loadCourseType, detailsStatus } = useCourseTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_TYPE, { defaultValue: 'Course Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && courseTypeId) {
      //getCourseTypeById(courseTypeId);
      loadCourseType(courseTypeId);
    }
  }, [visible, mode, courseTypeId, loadCourseType]);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={courseTypeId} // Force remount when courseTypeId changes
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
      <CourseTypeForm
        mode={mode}
        courseTypeId={courseTypeId}
        initialValues={selectedCourseType || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default CourseTypeFormDrawer;
