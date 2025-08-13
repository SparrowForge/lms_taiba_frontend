'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useCourses} from '@/hooks/useCourses';
import {useLocalization} from '@/hooks/useLocalization';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' });
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
      key={courseId} // Force remount when courseId changes
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
