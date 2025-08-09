'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateCourseTypeDetailsConfig} from '@/components/courseTypes/courseTypeConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useCourseTypes} from '@/hooks/useCourseTypes';

import {Status} from '@/types/common';
import {ICourseType} from '@/types/courseType';

interface PageProps {
  params: Promise<{ id: string }>;
}

const CourseTypeDetailPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { courseTypes, listStatus, loadCourseTypes, getCourseTypeById, loadCourseType } =
    useCourseTypes();
  const [item, setItem] = useState<ICourseType | null>(null);
  const t = useTranslations();
  const entityName = t('courseType');

  useEffect(() => {
    const itemId = parseInt(resolvedParams.id);
    const found = getCourseTypeById(itemId);
    if (found) setItem(found);
    else loadCourseType(itemId);
  }, [resolvedParams.id, getCourseTypeById, loadCourseType]);

  useEffect(() => {
    if (courseTypes.length === 0) loadCourseTypes();
  }, [courseTypes.length, loadCourseTypes]);

  useEffect(() => {
    if (courseTypes.length > 0) {
      const found = getCourseTypeById(parseInt(resolvedParams.id));
      if (found) setItem(found);
    }
  }, [courseTypes, resolvedParams.id, getCourseTypeById]);

  const config = useCreateCourseTypeDetailsConfig(
    item,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ICourseType>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseTypeDetailPage;
