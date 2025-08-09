'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import MenuForm from '@/components/menus/MenuForm';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateMenuPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('menu', { defaultValue: 'Menu' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <MenuForm mode="create" embedded={false} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
