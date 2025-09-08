'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CourseTypeForm from '@/components/courseTypes/CourseTypeForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';

export default function CreateCourseTypePage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.COURSE_TYPE, { defaultValue: 'Course Type' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <CourseTypeForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
