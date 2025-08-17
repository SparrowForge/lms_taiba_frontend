'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import MenuDetailsDrawer from '@/components/menus/MenuDetailsDrawer';
import MenuFormDrawer from '@/components/menus/MenuFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';

import {Status} from '@/types/common';
import {IMenu} from '@/types/menu';
import {IPanel} from '@/types/panel';

export default function MenusPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsMenuId, setSelectedDetailsMenuId] = useState<number | undefined>();

  const { menus, listStatus, pagination, loadMenus, removeMenu } = useMenus();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadMenus({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadMenus({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadMenus]);

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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/menus',
    searchFields: ['name', 'route', 'status'] as (keyof IMenu)[],
    onSearch: (searchText: string) => {
      loadMenus({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: menus,
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
        title: t(LOCALE_KEYS.LOCAL_NAME),
        dataIndex: 'localName',
        key: 'localName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.ICON),
        dataIndex: 'icon',
        key: 'icon',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.ROUTE),
        dataIndex: 'route',
        key: 'route',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.PANEL),
        dataIndex: 'panel',
        key: 'panel',
        render: (panel: IPanel) => <span>{panel?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.PARENT),
        dataIndex: 'parent',
        key: 'parent',
        render: (parent: IMenu) => <span>{parent?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.SORT_ORDER),
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t(LOCALE_KEYS.CREATED_AT),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (menu: IMenu) => (
          <EntityActions
            onView={() => router.push(`/menus/${menu.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/menus/${menu.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeMenu(menu.id)}
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
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
              : null
          }
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
