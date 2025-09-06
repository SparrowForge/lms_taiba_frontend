'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';
import UserForm from '@/components/users/UserForm';

import {useLocalization} from '@/hooks/useLocalization';

export default function CreateUserPage() {
  const { t } = useLocalization();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.CREATE_NAME, { name: t(LOCALE_KEYS.USER) })}
          onBack={() => router.back()}
        />
        <UserForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
