'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import StudentFamilyForm from '@/components/studentFamilies/StudentFamilyForm';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';

export default function StudentFamilyCreatePage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.STUDENT_FAMILY, { defaultValue: 'Student Family' });
  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <StudentFamilyForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
