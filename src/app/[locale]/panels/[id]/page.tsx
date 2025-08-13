'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreatePanelDetailsConfig} from '@/components/panels/panelConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {usePanels} from '@/hooks/usePanels';

import {Status} from '@/types/common';
import {IPanel} from '@/types/panel';

export default function PanelDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedPanel, detailsStatus, getPanelById } = usePanels();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.PANEL, { defaultValue: 'Panel' });

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
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
