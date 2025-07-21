'use client';

import React from 'react';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import MenuForm from '@/components/menus/MenuForm';
import {useTranslations} from 'next-intl';
import {PageHeader} from '@/components/ui/PageHeader';
import {useRouter} from 'next/navigation';

export default function CreateMenuPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('menu', { defaultValue: 'Menu' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader
            title={t('create_name', { name: entityName })}
            onBack={() => router.back()}
          />
          <MenuForm
            mode="create"
            embedded={false}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
