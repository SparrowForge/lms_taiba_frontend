'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import MenuForm from '@/components/menus/MenuForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';


export default function CreateMenuPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })} onBack={() => router.back()} />
          <MenuForm mode="create" embedded={false} />
      </MainLayout>
    </ProtectedRoute>
  );
}
