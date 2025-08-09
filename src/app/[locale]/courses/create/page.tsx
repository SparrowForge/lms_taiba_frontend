'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseForm from '@/components/courses/CourseForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateCoursePage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('course', { defaultValue: 'Course' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <CourseForm mode="create" embedded={false} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
