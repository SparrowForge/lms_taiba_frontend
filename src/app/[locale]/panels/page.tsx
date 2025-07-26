'use client';

import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import {IPanel} from '@/types/panel';
import {usePanels} from '@/hooks/usePanels';
import {useEffect, useState} from 'react';
import {Status} from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRouter, useSearchParams} from 'next/navigation';
import PanelFormDrawer from '@/components/panels/PanelFormDrawer';
import PanelDetailsDrawer from '@/components/panels/PanelDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {useTranslations} from 'next-intl';

export default function PanelsPage() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedPanelId, setSelectedPanelId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsPanelId, setSelectedDetailsPanelId] = useState<number | undefined>();
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });

  const { panels, listStatus, pagination, loadPanels, removePanel } = usePanels();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    const page = skip ? parseInt(skip) / parseInt(limit ?? '10') + 1 : 1;
    loadPanels({ page, limit: parseInt(limit ?? '10') });
  }, [skip, limit, loadPanels]);

  useEffect(() => {
    loadPanels({ page: 1, limit: 10 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    title: t('managemen_name', { name: entityName }),
    route: '/panels',
    searchFields: ['name'] as (keyof IPanel)[],
    onSearch: (searchText: string) => {
      loadPanels({ page: 1, limit: 10, search: searchText });
    },
    onAdd: handleCreateDrawer,
    items: panels,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('name'),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('createdAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t('actions'),
        key: 'actions',
        width: 100,
        render: (panel: IPanel) => (
          <EntityActions
            onView={() => router.push(`/panels/${panel.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/panels/${panel.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
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
          error={listStatus.status === Status.FAILED ? new Error(listStatus.message || t('failed_name', { name: entityName })) : null}
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
