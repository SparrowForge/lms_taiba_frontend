'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleMenuPermissionDetailsDrawer from '@/components/roleMenuPermissions/RoleMenuPermissionDetailsDrawer';
import RoleMenuPermissionFormDrawer from '@/components/roleMenuPermissions/RoleMenuPermissionFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IMenu} from '@/types/menu';
import {IRole} from '@/types/role';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';

export default function RoleMenuPermissionsPage() {
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const {
    roleMenuPermissions,
    listStatus,
    pagination,
    loadRoleMenuPermissions,
    removeRoleMenuPermission,
  } = useRoleMenuPermissions();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadRoleMenuPermissions({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadRoleMenuPermissions({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadRoleMenuPermissions]);

  const handleEditDrawer = (id: number) => {
    setSelectedId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadRoleMenuPermissions({ page: 1, limit: 10 });
  };

  const handleViewDetails = (id: number) => {
    setSelectedDetailsId(id);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (id: number) => {
    setDetailsDrawerVisible(false);
    setSelectedId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IRoleMenuPermission> = {
    name: entityName,
    title: t('management_name', { name: entityName }),
    route: '/role-menu-permissions',
    searchFields: [] as (keyof IRoleMenuPermission)[],
    onSearch: (searchText: string) => {
      loadRoleMenuPermissions({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: roleMenuPermissions,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('role'),
        dataIndex: 'role',
        key: 'role',
        render: (role: IRole) => <span>{role?.name || 'N/A'}</span>,
      },
      {
        title: t('menu'),
        dataIndex: 'menu',
        key: 'menu',
        render: (menu: IMenu) => <span>{menu?.name || 'N/A'}</span>,
      },
      {
        title: t('view'),
        dataIndex: 'view',
        key: 'view',
        render: (value: boolean) => <span>{value ? t('yes') : t('no')}</span>,
      },
      {
        title: t('insert'),
        dataIndex: 'insert',
        key: 'insert',
        render: (value: boolean) => <span>{value ? t('yes') : t('no')}</span>,
      },
      {
        title: t('update'),
        dataIndex: 'update',
        key: 'update',
        render: (value: boolean) => <span>{value ? t('yes') : t('no')}</span>,
      },
      {
        title: t('delete'),
        dataIndex: 'delete',
        key: 'delete',
        render: (value: boolean) => <span>{value ? t('yes') : t('no')}</span>,
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
        render: (permission: IRoleMenuPermission) => (
          <EntityActions
            onView={() =>
              router.push(`/role-menu-permissions/${permission.id}`)
            }
            onViewModal={() => handleViewDetails(permission.id)}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() =>
              router.push(`/role-menu-permissions/${permission.id}/edit`)
            }
            onEditModal={() => handleEditDrawer(permission.id)}
            editModalText={t('quickEdit')}
            onDelete={() => removeRoleMenuPermission(permission.id)}
            id={permission.id}
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
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
              : null
          }
          onRetry={() => loadRoleMenuPermissions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IRoleMenuPermission>} />
        </AsyncErrorBoundary>

        <RoleMenuPermissionFormDrawer
          mode={drawerMode}
          id={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <RoleMenuPermissionDetailsDrawer
          id={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
