'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateCourseAssignmentSubmissionDetailsConfig } from '@/components/courseAssignmentSubmissions/courseAssignmentSubmissionConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useCourseAssignmentSubmissions } from '@/hooks/useCourseAssignmentSubmissions';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourseAssignmentSubmission } from '@/types/courseAssignmentSubmission';

export default function CourseAssignmentSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { selectedCourseAssignmentSubmission, detailsStatus, loadCourseAssignmentSubmission } =
    useCourseAssignmentSubmissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT_SUBMISSION, {
    defaultValue: 'Course Assignment Submission',
  });

  const resolvedParams = React.use(params);
  const courseAssignmentSubmissionId = parseInt(resolvedParams.id);

  // Load course assignment submission if not already loaded
  useEffect(() => {
    //getCourseAssignmentSubmissionById(courseAssignmentSubmissionId);
    loadCourseAssignmentSubmission(courseAssignmentSubmissionId);
  }, [loadCourseAssignmentSubmission, courseAssignmentSubmissionId]);

  const config = useCreateCourseAssignmentSubmissionDetailsConfig(
    selectedCourseAssignmentSubmission,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ICourseAssignmentSubmission>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
