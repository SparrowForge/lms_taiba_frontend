'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseTypeForm from '@/components/courseTypes/CourseTypeForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useCourseTypes} from '@/hooks/useCourseTypes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';

const CourseTypeEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedCourseType, detailsStatus, loadCourseType } = useCourseTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_TYPE, { defaultValue: 'Course Type' });

  useEffect(() => {
    const courseTypeId = parseInt(resolvedParams.id);
    //getCourseTypeById(courseTypeId);
    loadCourseType(courseTypeId);
  }, [resolvedParams.id, loadCourseType]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedCourseType || selectedCourseType.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/course-types" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <CourseTypeForm
          mode="edit"
          courseTypeId={parseInt(resolvedParams.id)}
          initialValues={selectedCourseType}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseTypeEditPage;
