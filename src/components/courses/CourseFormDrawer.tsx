'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useCourses} from '@/hooks/useCourses';

import CourseForm from './CourseForm';


interface CourseFormDrawerProps {
  mode: 'create' | 'edit';
  courseId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CourseFormDrawer: React.FC<CourseFormDrawerProps> = ({
  mode,
  courseId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getCourseById, selectedCourse } = useCourses();
  const t = useTranslations();
  const entityName = t('course', { defaultValue: 'Course' });
  useEffect(() => {
    if (visible && mode === 'edit' && courseId) {
      getCourseById(courseId);
    }
  }, [visible, mode, courseId, getCourseById]);

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
      <CourseForm
        mode={mode}
        courseId={courseId}
        initialValues={selectedCourse || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default CourseFormDrawer;
