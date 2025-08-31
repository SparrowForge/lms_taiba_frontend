'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useCourseAssignments} from '@/hooks/useCourseAssignments';
import {useLocalization} from '@/hooks/useLocalization';

import {ICourseAssignment} from '@/types/courseAssignment';

import CourseAssignmentForm from './CourseAssignmentForm';

interface CourseAssignmentFormDrawerProps {
  mode: 'create' | 'edit';
  courseAssignmentId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CourseAssignmentFormDrawer: React.FC<CourseAssignmentFormDrawerProps> = ({
  mode,
  courseAssignmentId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getCourseAssignmentById, selectedCourseAssignment } = useCourseAssignments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT, { defaultValue: 'Course Assignment' });

  // Convert ICourseAssignment to form-compatible type (null -> undefined)
  const convertToFormValues = (courseAssignment: ICourseAssignment | null) => {
    if (!courseAssignment) return undefined;

    return {
      ...courseAssignment,
      latePenalty: courseAssignment.latePenalty ?? undefined,
      attachmentPath: courseAssignment.attachmentPath ?? undefined,
    };
  };

  useEffect(() => {
    if (visible && mode === 'edit' && courseAssignmentId) {
      getCourseAssignmentById(courseAssignmentId);
    }
  }, [visible, mode, courseAssignmentId, getCourseAssignmentById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={courseAssignmentId} // Force remount when courseAssignmentId changes
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
      <CourseAssignmentForm
        mode={mode}
        courseAssignmentId={courseAssignmentId}
        initialValues={convertToFormValues(selectedCourseAssignment)}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default CourseAssignmentFormDrawer;
