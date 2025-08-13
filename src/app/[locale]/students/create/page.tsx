'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import StudentForm from '@/components/students/StudentForm';
import {PageHeader} from '@/components/ui/PageHeader';

export default function StudentCreatePage() {
  const router = useRouter();
  const t = useTranslations();
  const entityName = t('student');

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
        <StudentForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
