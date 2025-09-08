'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseForm from '@/components/courses/CourseForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useCourses} from '@/hooks/useCourses';
import {useLocalization} from '@/hooks/useLocalization';

const CourseEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedCourse, detailsStatus, loadCourse } = useCourses();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' });

  useEffect(() => {
    const courseId = parseInt(resolvedParams.id);
    //getCourseById(courseId);
    loadCourse(courseId);
  }, [resolvedParams.id, loadCourse]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedCourse || selectedCourse.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/courses" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <CourseForm
          mode="edit"
          courseId={parseInt(resolvedParams.id)}
          initialValues={selectedCourse}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseEditPage;
