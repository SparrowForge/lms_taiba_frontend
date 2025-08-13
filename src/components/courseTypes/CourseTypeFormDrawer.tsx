'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useCourseTypes} from '@/hooks/useCourseTypes';

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
  const { getCourseTypeById, selectedCourseType } = useCourseTypes();
  const t = useTranslations();
  const entityName = t('courseType', { defaultValue: 'Course Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && courseTypeId) {
      getCourseTypeById(courseTypeId);
    }
  }, [visible, mode, courseTypeId, getCourseTypeById]);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={courseTypeId} // Force remount when courseTypeId changes
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
