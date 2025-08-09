'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';
import UserForm from '@/components/users/UserForm';


export default function CreateUserPage() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('create_name', { name: t('user') })} onBack={() => router.back()} />
          <UserForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
