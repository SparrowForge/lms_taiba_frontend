'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useCourses} from '@/hooks/useCourses';
import {useLocalization} from '@/hooks/useLocalization';

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

  const { selectedCourse, loadCourse, detailsStatus } = useCourses();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' });
  useEffect(() => {
    if (visible && courseId) {
      //getCourseById(courseId);
      loadCourse(courseId);
    }
  }, [visible, courseId, loadCourse]);

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
      key={courseId} // Force remount when courseId changes
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
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
