'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useCourseAssignmentSubmissions } from '@/hooks/useCourseAssignmentSubmissions';
import { useLocalization } from '@/hooks/useLocalization';

import CourseAssignmentSubmissionForm from './CourseAssignmentSubmissionForm';

interface CourseAssignmentSubmissionFormDrawerProps {
  mode: 'create' | 'edit';
  courseAssignmentSubmissionId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CourseAssignmentSubmissionFormDrawer: React.FC<CourseAssignmentSubmissionFormDrawerProps> = ({
  mode,
  courseAssignmentSubmissionId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const {
    getCourseAssignmentSubmissionById,
    selectedCourseAssignmentSubmission,
    loadCourseAssignmentSubmission,
    detailsStatus,
  } = useCourseAssignmentSubmissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT_SUBMISSION, {
    defaultValue: 'Course Assignment Submission',
  });

  useEffect(() => {
    if (visible && mode === 'edit' && courseAssignmentSubmissionId) {
      //getCourseAssignmentSubmissionById(courseAssignmentSubmissionId);
      loadCourseAssignmentSubmission(courseAssignmentSubmissionId);
    }
  }, [visible, mode, courseAssignmentSubmissionId, loadCourseAssignmentSubmission]);

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
      key={courseAssignmentSubmissionId} // Force remount when courseAssignmentSubmissionId changes
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
      <CourseAssignmentSubmissionForm
        mode={mode}
        courseAssignmentSubmissionId={courseAssignmentSubmissionId}
        initialValues={selectedCourseAssignmentSubmission || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default CourseAssignmentSubmissionFormDrawer;
