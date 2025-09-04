'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import PanelDetailsDrawer from '@/components/panels/PanelDetailsDrawer';
import PanelFormDrawer from '@/components/panels/PanelFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useLocalization} from '@/hooks/useLocalization';
import {usePanels} from '@/hooks/usePanels';

import {Status} from '@/types/common';
import {IPanel} from '@/types/panel';

export default function PanelsPage() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedPanelId, setSelectedPanelId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsPanelId, setSelectedDetailsPanelId] = useState<number | undefined>();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.PANEL, { defaultValue: 'Panel' });

  const { panels, listStatus, pagination, loadPanels, removePanel } = usePanels();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadPanels({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadPanels({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadPanels]);

  const handleEditDrawer = (panelId: number) => {
    setSelectedPanelId(panelId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedPanelId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadPanels({ page: 1, limit: 10 });
  };

  const handleViewDetails = (panelId: number) => {
    setSelectedDetailsPanelId(panelId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (panelId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedPanelId(panelId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IPanel> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/panels',
    searchFields: ['name', 'status'] as (keyof IPanel)[],
    onSearch: (searchText: string) => {
      loadPanels({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: panels,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.NAME),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.CREATED_AT),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (panel: IPanel) => (
          <EntityActions
            onView={() => router.push(`/panels/${panel.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/panels/${panel.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removePanel(panel.id)}
            id={panel.id}
          />
        ),
      },
    ],
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <AsyncErrorBoundary
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
              : null
          }
          onRetry={() => loadPanels({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IPanel>} />
        </AsyncErrorBoundary>

        <PanelFormDrawer
          mode={drawerMode}
          panelId={selectedPanelId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <PanelDetailsDrawer
          panelId={selectedDetailsPanelId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
