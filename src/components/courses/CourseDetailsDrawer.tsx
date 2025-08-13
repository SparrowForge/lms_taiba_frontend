'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useCourses} from '@/hooks/useCourses';

import {Status} from '@/types/common';
import {ICourse} from '@/types/course';

import {useCreateCourseDetailsConfig} from './courseConfig';


interface CourseDetailsDrawerProps {
  courseId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (courseId: number) => void;
}

const CourseDetailsDrawer: React.FC<CourseDetailsDrawerProps> = ({
  courseId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedCourse, getCourseById, detailsStatus } = useCourses();
  const t = useTranslations();
  const entityName = t('course', { defaultValue: 'Course' });
  useEffect(() => {
    if (visible && courseId) {
      getCourseById(courseId);
    }
  }, [visible, courseId, getCourseById]);

  const handleEdit = (course: ICourse) => {
    onEdit(course.id);
  };

  const config = useCreateCourseDetailsConfig(
    selectedCourse,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default CourseDetailsDrawer;
