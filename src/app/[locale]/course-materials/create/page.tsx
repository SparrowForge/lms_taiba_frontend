'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CourseMaterialForm from '@/components/courseMaterials/CourseMaterialForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';

export default function CreateCourseMaterialPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <CourseMaterialForm mode="create" embedded={false} />
      </MainLayout>
    </ProtectedRoute>
  );
}
