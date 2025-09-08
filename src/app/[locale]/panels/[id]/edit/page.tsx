'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import PanelForm from '@/components/panels/PanelForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import { usePanels } from '@/hooks/usePanels';

const PanelEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedPanel, detailsStatus, loadPanel } = usePanels();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.PANEL, { defaultValue: 'Panel' });

  useEffect(() => {
    const panelId = parseInt(resolvedParams.id);
    //getPanelById(panelId);
    loadPanel(panelId);
  }, [resolvedParams.id, loadPanel]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedPanel || selectedPanel.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/panels" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <PanelForm
          mode="edit"
          panelId={parseInt(resolvedParams.id)}
          initialValues={selectedPanel}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PanelEditPage;
