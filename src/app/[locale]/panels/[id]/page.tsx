'use client';

import React, {useEffect, useState} from 'react';
import {usePanels} from '@/hooks/usePanels';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {IPanel} from '@/types/panel';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreatePanelDetailsConfig} from '@/components/panels/panelConfig';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

interface PanelDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PanelDetailPage: React.FC<PanelDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { panels, listStatus, loadPanels, getPanelById, loadPanel } = usePanels();
  const [panel, setPanel] = useState<IPanel | null>(null);
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });

  useEffect(() => {
    const panelId = parseInt(resolvedParams.id);
    const foundPanel = getPanelById(panelId);
    if (foundPanel) {
      setPanel(foundPanel);
    } else {
      loadPanel(panelId);
    }
  }, [resolvedParams.id, getPanelById, loadPanel]);

  useEffect(() => {
    if (panels.length === 0) {
      loadPanels();
    }
  }, [panels.length, loadPanels]);

  useEffect(() => {
    if (panels.length > 0) {
      const foundPanel = getPanelById(parseInt(resolvedParams.id));
      if (foundPanel) {
        setPanel(foundPanel);
      }
    }
  }, [panels, resolvedParams.id, getPanelById]);

  const config = useCreatePanelDetailsConfig(
    panel,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || t('failed_name', { name: entityName }) : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IPanel>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PanelDetailPage;
