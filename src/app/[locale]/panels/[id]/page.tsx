'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreatePanelDetailsConfig} from '@/components/panels/panelConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {usePanels} from '@/hooks/usePanels';

import {Status} from '@/types/common';
import {IPanel} from '@/types/panel';

export default function PanelDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedPanel, detailsStatus, getPanelById } = usePanels();
  const t = useTranslations();
  const entityName = t('panel');

  const resolvedParams = React.use(params);
  const panelId = parseInt(resolvedParams.id);

  // Load panel if not already loaded
  useEffect(() => {
    getPanelById(panelId);
  }, [getPanelById, panelId]);

  const config = useCreatePanelDetailsConfig(
    selectedPanel,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IPanel>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
