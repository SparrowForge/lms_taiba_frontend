'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseAssignmentForm from '@/components/courseAssignments/CourseAssignmentForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useCourseAssignments} from '@/hooks/useCourseAssignments';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {ICourseAssignment, ICourseAssignmentUpdate} from '@/types/courseAssignment';

const CourseAssignmentEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedCourseAssignment, detailsStatus, loadCourseAssignment } = useCourseAssignments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT, { defaultValue: 'Course Assignment' });

  useEffect(() => {
    const courseAssignmentId = parseInt(resolvedParams.id);
    //getCourseAssignmentById(courseAssignmentId);
    loadCourseAssignment(courseAssignmentId);
  }, [resolvedParams.id, loadCourseAssignment]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedCourseAssignment || selectedCourseAssignment.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/course-assignments" />;
  }

  // Convert ICourseAssignment to ICourseAssignmentUpdate for form compatibility
  const convertToFormValues = (courseAssignment: ICourseAssignment): Partial<ICourseAssignmentUpdate> => {
    const { id, createdAt, updatedAt, deletedAt, course, subject, semester, batch, faculty, ...formValues } = courseAssignment;
    return {
      ...formValues,
      latePenalty: formValues.latePenalty ?? undefined,
      attachmentPath: formValues.attachmentPath ?? undefined,
    };
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
        <CourseAssignmentForm
          mode="edit"
          courseAssignmentId={parseInt(resolvedParams.id)}
          initialValues={convertToFormValues(selectedCourseAssignment)}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseAssignmentEditPage;
