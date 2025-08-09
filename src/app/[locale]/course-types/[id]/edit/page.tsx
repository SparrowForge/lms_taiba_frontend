'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseTypeForm from '@/components/courseTypes/CourseTypeForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useCourseTypes} from '@/hooks/useCourseTypes';

import {ICourseType} from '@/types/courseType';


interface PageProps {
  params: Promise<{ id: string }>;
}

const CourseTypeEditPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
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

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            {t('loading', { defaultValue: 'Loading...' })}
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!item) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/course-types')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => router.back();

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <CourseTypeForm
            mode="edit"
            courseTypeId={parseInt(resolvedParams.id)}
          initialValues={{ name: item.name, status: item.status }}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CourseTypeEditPage;
