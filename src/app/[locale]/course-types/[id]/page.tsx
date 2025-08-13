'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateCourseTypeDetailsConfig} from '@/components/courseTypes/courseTypeConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useCourseTypes} from '@/hooks/useCourseTypes';

import {Status} from '@/types/common';
import {ICourseType} from '@/types/courseType';

export default function CourseTypeDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedCourseType, detailsStatus, getCourseTypeById } = useCourseTypes();
  const t = useTranslations();
  const entityName = t('courseType');

  const resolvedParams = React.use(params);
  const courseTypeId = parseInt(resolvedParams.id);

  // Load course type if not already loaded
  useEffect(() => {
    getCourseTypeById(courseTypeId);
  }, [getCourseTypeById, courseTypeId]);

  const config = useCreateCourseTypeDetailsConfig(
    selectedCourseType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
