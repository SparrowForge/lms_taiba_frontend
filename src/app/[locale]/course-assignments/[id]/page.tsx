'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateCourseAssignmentDetailsConfig} from '@/components/courseAssignments/courseAssignmentConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useCourseAssignments} from '@/hooks/useCourseAssignments';
import {useLocalization} from '@/hooks/useLocalization';

import {ICourseAssignment} from '@/types/courseAssignment';

export default function CourseAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { selectedCourseAssignment, detailsStatus, loadCourseAssignment } = useCourseAssignments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT, { defaultValue: 'Course Assignment' });

  const resolvedParams = React.use(params);
  const courseAssignmentId = parseInt(resolvedParams.id);

  // Load course assignment if not already loaded
  useEffect(() => {
    //getCourseAssignmentById(courseAssignmentId);
    loadCourseAssignment(courseAssignmentId);
  }, [loadCourseAssignment, courseAssignmentId]);

  const config = useCreateCourseAssignmentDetailsConfig(
    selectedCourseAssignment,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ICourseAssignment>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
