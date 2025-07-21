'use client';

import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';
import {useEffect, useState} from 'react';
import {Status} from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRouter} from 'next/navigation';
import RoleMenuPermissionFormDrawer from '@/components/roleMenuPermissions/RoleMenuPermissionFormDrawer';
import RoleMenuPermissionDetailsDrawer from '@/components/roleMenuPermissions/RoleMenuPermissionDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {useTranslations} from 'next-intl';

export default function RoleMenuPermissionsPage() {
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsRoleId, setSelectedDetailsRoleId] = useState<number | undefined>();
  const [selectedDetailsMenuId, setSelectedDetailsMenuId] = useState<number | undefined>();

  const { roleMenuPermissions, listStatus, pagination, loadRoleMenuPermissions } = useRoleMenuPermissions();

  useEffect(() => {
    loadRoleMenuPermissions({ page: 1, limit: 10 });
  }, [loadRoleMenuPermissions]);

  const handleEditDrawer = (roleId: number, menuId: number) => {
    setSelectedRoleId(roleId);
    setSelectedMenuId(menuId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedRoleId(undefined);
    setSelectedMenuId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadRoleMenuPermissions({ page: 1, limit: 10 });
  };

  const handleViewDetails = (roleId: number, menuId: number) => {
    setSelectedDetailsRoleId(roleId);
    setSelectedDetailsMenuId(menuId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (roleId: number, menuId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedRoleId(roleId);
    setSelectedMenuId(menuId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IRoleMenuPermission> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/role-menu-permissions',
    searchFields: ['role.name', 'menu.name'] as any,
    onSearch: (searchText: string) => {
      loadRoleMenuPermissions({ page: 1, limit: 10, search: searchText });
    },
    onAdd: handleCreateDrawer,
    items: roleMenuPermissions,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('role'),
        dataIndex: 'role',
        key: 'role',
        render: (role: any) => <span>{role?.name || 'N/A'}</span>,
      },
      {
        title: t('menu'),
        dataIndex: 'menu',
        key: 'menu',
        render: (menu: any) => <span>{menu?.name || 'N/A'}</span>,
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
        width: 200,
        render: (permission: IRoleMenuPermission) => (
          <EntityActions
            onView={() => router.push(`/role-menu-permissions/${permission.roleId}/${permission.menuId}`)}
            onViewModal={() => handleViewDetails(permission.roleId, permission.menuId)}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/role-menu-permissions/${permission.roleId}/${permission.menuId}/edit`)}
            onEditModal={() => handleEditDrawer(permission.roleId, permission.menuId)}
            editModalText={t('quickEdit')}
            onDelete={() => {}}
            id={permission.roleId}
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
          onRetry={() => loadRoleMenuPermissions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as any} />
        </AsyncErrorBoundary>

        <RoleMenuPermissionFormDrawer
          mode={drawerMode}
          roleId={selectedRoleId}
          menuId={selectedMenuId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <RoleMenuPermissionDetailsDrawer
          roleId={selectedDetailsRoleId}
          menuId={selectedDetailsMenuId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
