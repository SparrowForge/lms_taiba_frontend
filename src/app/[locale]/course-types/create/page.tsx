'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseTypeForm from '@/components/courseTypes/CourseTypeForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateCourseTypePage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('courseType', { defaultValue: 'Course Type' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <CourseTypeForm mode="create" />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
