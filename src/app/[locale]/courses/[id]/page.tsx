'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateCourseDetailsConfig} from '@/components/courses/courseConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useCourses} from '@/hooks/useCourses';
import {useLocalization} from '@/hooks/useLocalization';

import {ICourse} from '@/types/course';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedCourse, detailsStatus, loadCourse } = useCourses();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' });

  const resolvedParams = React.use(params);
  const courseId = parseInt(resolvedParams.id);

  // Load course if not already loaded
  useEffect(() => {
    //getCourseById(courseId);
    loadCourse(courseId);
  }, [loadCourse, courseId]);

  const config = useCreateCourseDetailsConfig(
    selectedCourse,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ICourse>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
