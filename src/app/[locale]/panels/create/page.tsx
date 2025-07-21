'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {PageHeader} from '@/components/ui/PageHeader';
import PanelForm from '@/components/panels/PanelForm';
import {useTranslations} from 'next-intl';

export default function CreatePanelPage() {
  const router = useRouter();
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <PanelForm mode="create" />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
