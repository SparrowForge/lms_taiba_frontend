import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useCourses} from '@/hooks/useCourses';

import {ICourse} from '@/types/course';

import CourseForm from './CourseForm';


interface CourseFormDrawerProps {
  mode: 'create' | 'edit';
  courseId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const CourseFormDrawer: React.FC<CourseFormDrawerProps> = ({
  mode,
  courseId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<ICourse> | undefined>();
  const { getCourseById, loadCourse } = useCourses();
  const t = useTranslations();
  const entityName = t('course', { defaultValue: 'Course' });

  useEffect(() => {
    if (mode === 'edit' && courseId && visible) {
      const foundCourse = getCourseById(courseId);
      if (foundCourse) {
        setInitialValues(foundCourse);
      } else {
        loadCourse(courseId);
      }
    }
  }, [mode, courseId, visible, getCourseById, loadCourse]);

  const getTitle = () =>
    mode === 'create'
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };


  return (
    <Drawer title={getTitle()} open={visible} onClose={onCancel} width={500} placement="right">
      <CourseForm
        mode={mode}
        courseId={courseId}
        initialValues={initialValues}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default CourseFormDrawer;
