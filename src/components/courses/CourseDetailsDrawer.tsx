import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {useCourses} from '@/hooks/useCourses';
import {ICourse} from '@/types/course';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';
import {useCreateCourseDetailsConfig} from './courseConfig';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

interface CourseDetailsDrawerProps {
  courseId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit?: (courseId: number) => void;
}

const CourseDetailsDrawer: React.FC<CourseDetailsDrawerProps> = ({
  courseId,
  visible,
  onClose,
  onEdit
}) => {
  const { courses, listStatus, loadCourses, getCourseById, loadCourse } = useCourses();
  const [course, setCourse] = useState<ICourse | null>(null);
  const t = useTranslations();
  const entityName = t('course', { defaultValue: 'Course' });

  useEffect(() => {
    if (courseId && visible) {
      const foundCourse = getCourseById(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        loadCourse(courseId);
      }
    }
  }, [courseId, visible, getCourseById, loadCourse]);

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses();
    }
  }, [courses.length, loadCourses]);

  useEffect(() => {
    if (courses.length > 0 && courseId) {
      const foundCourse = getCourseById(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      }
    }
  }, [courses, courseId, getCourseById]);

  const config = useCreateCourseDetailsConfig(
    course,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null,
    { embedded: true, onEdit: onEdit ? (p) => onEdit(p.id) : undefined }
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      open={visible}
      onClose={onClose}
      width={500}
      placement="right"
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default CourseDetailsDrawer;
