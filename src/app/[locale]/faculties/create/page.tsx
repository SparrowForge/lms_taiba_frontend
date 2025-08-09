'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FacultyForm from '@/components/faculties/FacultyForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


const FacultyCreatePage: React.FC = () => {
  const t = useTranslations();
  const entityName = t('faculty', { defaultValue: 'Faculty' });
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={handleBack} />

          <FacultyForm mode="create" embedded={false} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FacultyCreatePage;
