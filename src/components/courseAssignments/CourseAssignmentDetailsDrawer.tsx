'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useCourseAssignments} from '@/hooks/useCourseAssignments';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {ICourseAssignment} from '@/types/courseAssignment';

import {useCreateCourseAssignmentDetailsConfig} from './courseAssignmentConfig';

interface CourseAssignmentDetailsDrawerProps {
  courseAssignmentId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (courseAssignmentId: number) => void;
}

const CourseAssignmentDetailsDrawer: React.FC<CourseAssignmentDetailsDrawerProps> = ({
  courseAssignmentId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedCourseAssignment, loadCourseAssignment, detailsStatus } = useCourseAssignments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT, { defaultValue: 'Course Assignment' });

  useEffect(() => {
    if (visible && courseAssignmentId) {
      //getCourseAssignmentById(courseAssignmentId);
      loadCourseAssignment(courseAssignmentId);
    }
  }, [visible, courseAssignmentId, loadCourseAssignment]);

  const handleEdit = (courseAssignment: ICourseAssignment) => {
    onEdit(courseAssignment.id);
  };

  const config = useCreateCourseAssignmentDetailsConfig(
    selectedCourseAssignment,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={courseAssignmentId} // Force remount when courseAssignmentId changes
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

export default CourseAssignmentDetailsDrawer;
