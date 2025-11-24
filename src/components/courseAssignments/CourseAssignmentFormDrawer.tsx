'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourseAssignment } from '@/types/courseAssignment';

import CourseAssignmentForm from './CourseAssignmentForm';
import CourseAssignmentFacultyForm from './CourseAssignmentFacultyForm';

interface CourseAssignmentFormDrawerProps {
  mode: 'create' | 'edit';
  courseAssignmentId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  isAdmin:boolean
}

const CourseAssignmentFormDrawer: React.FC<CourseAssignmentFormDrawerProps> = ({
  mode,
  courseAssignmentId,
  visible,
  onCancel,
  onSuccess,
  isAdmin
}) => {
  const { getCourseAssignmentById, selectedCourseAssignment, loadCourseAssignment, detailsStatus } =
    useCourseAssignments();
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
      //getCourseAssignmentById(courseAssignmentId);
      loadCourseAssignment(courseAssignmentId);
    }
  }, [visible, mode, courseAssignmentId, loadCourseAssignment]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }



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
      {
        isAdmin === true ? <CourseAssignmentForm
        mode={mode}
        courseAssignmentId={courseAssignmentId}
        initialValues={convertToFormValues(selectedCourseAssignment)}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      /> :
       <CourseAssignmentFacultyForm
        mode={mode}
        courseAssignmentId={courseAssignmentId}
        initialValues={convertToFormValues(selectedCourseAssignment)}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
      }
     
    </Drawer>
  );
};

export default CourseAssignmentFormDrawer;
