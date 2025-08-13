'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseTypeForm from '@/components/courseTypes/CourseTypeForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useCourseTypes} from '@/hooks/useCourseTypes';

import {Status} from '@/types/common';


const CourseTypeEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedCourseType, detailsStatus, getCourseTypeById } = useCourseTypes();
  const t = useTranslations();
  const entityName = t('courseType');

  useEffect(() => {
    const courseTypeId = parseInt(resolvedParams.id);
    getCourseTypeById(courseTypeId);
  }, [resolvedParams.id, getCourseTypeById]);


  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t('loading', { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedCourseType) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/course-types')}>
                  {t('backToList_name', { name: entityName })}</Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={() => router.back()} />
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
