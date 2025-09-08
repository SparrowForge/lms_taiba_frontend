'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import PanelForm from '@/components/panels/PanelForm';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';

export default function CreatePanelPage() {
  const router = useRouter();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.PANEL, { defaultValue: 'Panel' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <PanelForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
