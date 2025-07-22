import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {useCourses} from '@/hooks/useCourses';
import {ICourse} from '@/types/course';
import CourseForm from './CourseForm';
import {useTranslations} from 'next-intl';

interface CourseFormDrawerProps {
  mode: 'create' | 'edit';
  courseId?: number;
  initialValues?: Partial<ICourse>;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const CourseFormDrawer: React.FC<CourseFormDrawerProps> = ({
  mode,
  courseId,
  initialValues,
  visible,
  onCancel,
  onSuccess
}) => {
  const { getCourseById, loadCourse } = useCourses();
  const [course, setCourse] = useState<ICourse | null>(null);
  const t = useTranslations();
  const entityName = t('course', { defaultValue: 'Course' });

  useEffect(() => {
    if (mode === 'edit' && courseId && visible) {
      const foundCourse = getCourseById(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        loadCourse(courseId);
      }
    }
  }, [mode, courseId, visible, getCourseById, loadCourse]);

  const getTitle = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  const getFormInitialValues = () => {
    if (mode === 'edit' && course) {
      return {
        departmentId: course.departmentId,
        name: course.name,
        code: course.code,
        courseType: course.courseType,
        durationInSemesters: course.durationInSemesters,
        description: course.description,
      };
    }
    return initialValues;
  };

  return (
    <Drawer
      title={getTitle()}
      open={visible}
      onClose={onCancel}
      width={500}
      placement="right"
    >
      <CourseForm
        mode={mode}
        courseId={courseId}
        initialValues={getFormInitialValues()}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default CourseFormDrawer;
