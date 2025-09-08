'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useCourseAssignmentSubmissions} from '@/hooks/useCourseAssignmentSubmissions';
import {useLocalization} from '@/hooks/useLocalization';

import {ICourseAssignmentSubmission} from '@/types/courseAssignmentSubmission';

import {useCreateCourseAssignmentSubmissionDetailsConfig} from './courseAssignmentSubmissionConfig';

interface CourseAssignmentSubmissionDetailsDrawerProps {
  courseAssignmentSubmissionId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (courseAssignmentSubmissionId: number) => void;
}

const CourseAssignmentSubmissionDetailsDrawer: React.FC<
  CourseAssignmentSubmissionDetailsDrawerProps
> = ({ courseAssignmentSubmissionId, visible, onClose, onEdit }) => {
  const { selectedCourseAssignmentSubmission, loadCourseAssignmentSubmission, detailsStatus } =
    useCourseAssignmentSubmissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT_SUBMISSION, {
    defaultValue: 'Course Assignment Submission',
  });

  useEffect(() => {
    if (visible && courseAssignmentSubmissionId) {
      //getCourseAssignmentSubmissionById(courseAssignmentSubmissionId);
      loadCourseAssignmentSubmission(courseAssignmentSubmissionId);
    }
  }, [visible, courseAssignmentSubmissionId, loadCourseAssignmentSubmission]);

  const handleEdit = (courseAssignmentSubmission: ICourseAssignmentSubmission) => {
    onEdit(courseAssignmentSubmission.id);
  };

  const config = useCreateCourseAssignmentSubmissionDetailsConfig(
    selectedCourseAssignmentSubmission,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={courseAssignmentSubmissionId} // Force remount when courseAssignmentSubmissionId changes
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

export default CourseAssignmentSubmissionDetailsDrawer;
