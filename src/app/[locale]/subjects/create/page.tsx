'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import SubjectForm from '@/components/subjects/SubjectForm';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateSubjectPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('subject', { defaultValue: 'Subject' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <SubjectForm mode="create" embedded={false} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
