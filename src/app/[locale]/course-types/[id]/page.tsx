'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateCourseTypeDetailsConfig} from '@/components/courseTypes/courseTypeConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useCourseTypes} from '@/hooks/useCourseTypes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {ICourseType} from '@/types/courseType';

export default function CourseTypeDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedCourseType, detailsStatus, loadCourseType } = useCourseTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_TYPE, { defaultValue: 'Course Type' });

  const resolvedParams = React.use(params);
  const courseTypeId = parseInt(resolvedParams.id);

  // Load course type if not already loaded
  useEffect(() => {
    //getCourseTypeById(courseTypeId);
    loadCourseType(courseTypeId);
  }, [loadCourseType, courseTypeId]);

  const config = useCreateCourseTypeDetailsConfig(
    selectedCourseType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<ICourseType>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
