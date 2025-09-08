'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseAssignmentSubmissionForm from '@/components/courseAssignmentSubmissions/CourseAssignmentSubmissionForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useCourseAssignmentSubmissions} from '@/hooks/useCourseAssignmentSubmissions';
import {useLocalization} from '@/hooks/useLocalization';

const CourseAssignmentSubmissionEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedCourseAssignmentSubmission, detailsStatus, loadCourseAssignmentSubmission } =
    useCourseAssignmentSubmissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT_SUBMISSION, {
    defaultValue: 'Course Assignment Submission',
  });

  useEffect(() => {
    const courseAssignmentSubmissionId = parseInt(resolvedParams.id);
    //getCourseAssignmentSubmissionById(courseAssignmentSubmissionId);
    loadCourseAssignmentSubmission(courseAssignmentSubmissionId);
  }, [resolvedParams.id, loadCourseAssignmentSubmission]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (
    !selectedCourseAssignmentSubmission ||
    selectedCourseAssignmentSubmission.id !== parseInt(resolvedParams.id)
  ) {
    return (
      <EntityEditNotFoundView entityName={entityName} backRoute="/course-assignment-submissions" />
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <CourseAssignmentSubmissionForm
          mode="edit"
          courseAssignmentSubmissionId={parseInt(resolvedParams.id)}
          initialValues={selectedCourseAssignmentSubmission}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseAssignmentSubmissionEditPage;
