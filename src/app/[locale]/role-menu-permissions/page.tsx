'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleMenuPermissionDetailsDrawer from '@/components/roleMenuPermissions/RoleMenuPermissionDetailsDrawer';
import RoleMenuPermissionFormDrawer from '@/components/roleMenuPermissions/RoleMenuPermissionFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IMenu} from '@/types/menu';
import {IRole} from '@/types/role';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';

export default function RoleMenuPermissionsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });
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
    setDrawerVisible(false)
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
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
        title: t(LOCALE_KEYS.ROLE),
        dataIndex: 'role',
        key: 'role',
        render: (role: IRole) => <span>{role?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.MENU),
        dataIndex: 'menu',
        key: 'menu',
        render: (menu: IMenu) => <span>{menu?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.VIEW),
        dataIndex: 'view',
        key: 'view',
        render: (value: boolean) => <span>{value ? t('yes') : t('no')}</span>,
      },
      {
        title: t(LOCALE_KEYS.INSERT),
        dataIndex: 'insert',
        key: 'insert',
        render: (value: boolean) => <span>{value ? t('yes') : t('no')}</span>,
      },
      {
        title: t(LOCALE_KEYS.UPDATE),
        width: 80,
        dataIndex: 'update',
        key: 'update',
        render: (value: boolean) => <span>{value ? t('yes') : t('no')}</span>,
      },
      {
        title: t(LOCALE_KEYS.DELETE),
        dataIndex: 'delete',
        key: 'delete',
        render: (value: boolean) => <span>{value ? t('yes') : t('no')}</span>,
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
        render: (permission: IRoleMenuPermission) => (
          <EntityActions
            onView={() =>
              router.push(`/role-menu-permissions/${permission.id}`)
            }
            onViewModal={() => handleViewDetails(permission.id)}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() =>
              router.push(`/role-menu-permissions/${permission.id}/edit`)
            }
            onEditModal={() => handleEditDrawer(permission.id)}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
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
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
              : null
          }
          onRetry={() => loadRoleMenuPermissions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IRoleMenuPermission>} />
        </AsyncErrorBoundary>

        <RoleMenuPermissionFormDrawer
          mode={drawerMode}
          roleMenuPermissionId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <RoleMenuPermissionDetailsDrawer
          roleMenuPermissionId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
