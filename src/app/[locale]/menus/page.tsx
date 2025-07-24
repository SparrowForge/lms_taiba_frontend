'use client';

import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import {IMenu} from '@/types/menu';
import {useMenus} from '@/hooks/useMenus';
import {useEffect, useState} from 'react';
import {Status} from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRouter, useSearchParams} from 'next/navigation';
import MenuFormDrawer from '@/components/menus/MenuFormDrawer';
import MenuDetailsDrawer from '@/components/menus/MenuDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {useTranslations} from 'next-intl';
import {IPanel} from '@/types/panel';

export default function MenusPage() {
  const t = useTranslations();
  const entityName = t('menu', { defaultValue: 'Menu' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsMenuId, setSelectedDetailsMenuId] = useState<number | undefined>();

  const { menus, listStatus, pagination, loadMenus } = useMenus();


  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    const page = skip ? parseInt(skip) / parseInt(limit ?? '10') + 1 : 1;
    loadMenus({ page, limit: parseInt(limit ?? '10') });
  }, [skip, limit, loadMenus]);

  useEffect(() => {
    loadMenus({ page: 1, limit: 10 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditDrawer = (menuId: number) => {
    setSelectedMenuId(menuId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedMenuId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadMenus({ page: 1, limit: 10 });
  };

  const handleViewDetails = (menuId: number) => {
    setSelectedDetailsMenuId(menuId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (menuId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedMenuId(menuId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IMenu> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/menus',
    searchFields: ['name', 'route', 'panel.name'] as (keyof IMenu)[],
    onSearch: (searchText: string) => {
      loadMenus({ page: 1, limit: 10, search: searchText });
    },
    onAdd: handleCreateDrawer,
    items: menus,
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
        title: t('route'),
        dataIndex: 'route',
        key: 'route',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('panel'),
        dataIndex: 'panel',
        key: 'panel',
        render: (panel: IPanel) => <span>{panel?.name || 'N/A'}</span>,
      },
      {
        title: t('parent'),
        dataIndex: 'parent',
        key: 'parent',
        render: (parent: IMenu) => <span>{parent?.name || 'N/A'}</span>,
      },
      {
        title: t('sortOrder'),
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        render: (text: number) => <span>{text}</span>,
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
        render: (menu: IMenu) => (
          <EntityActions
            onView={() => router.push(`/menus/${menu.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/menus/${menu.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => {}}
            id={menu.id}
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
          loading={listStatus.status === Status.LOADING}
          onRetry={() => loadMenus({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IMenu>} />
        </AsyncErrorBoundary>

        <MenuFormDrawer
          mode={drawerMode}
          menuId={selectedMenuId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <MenuDetailsDrawer
          menuId={selectedDetailsMenuId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
