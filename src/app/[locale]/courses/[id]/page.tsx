'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateCourseDetailsConfig} from '@/components/courses/courseConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useCourses} from '@/hooks/useCourses';

import {Status} from '@/types/common';
import {ICourse} from '@/types/course';

export default function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedCourse, detailsStatus, getCourseById } = useCourses();
  const t = useTranslations();
  const entityName = t('course');

  const resolvedParams = React.use(params);
  const courseId = parseInt(resolvedParams.id);

  // Load course if not already loaded
  useEffect(() => {
    getCourseById(courseId);
  }, [getCourseById, courseId]);

  const config = useCreateCourseDetailsConfig(
    selectedCourse,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
