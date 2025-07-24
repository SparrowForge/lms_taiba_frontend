'use client';

import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import {IRole} from '@/types/role';
import {useRoles} from '@/hooks/useRoles';
import {useEffect, useState} from 'react';
import {Status} from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRouter, useSearchParams} from 'next/navigation';
import RoleFormDrawer from '@/components/roles/RoleFormDrawer';
import RoleDetailsDrawer from '@/components/roles/RoleDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {useTranslations} from 'next-intl';
import {IBranch} from '@/types/branch';

export default function RolesPage() {
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsRoleId, setSelectedDetailsRoleId] = useState<number | undefined>();

  const { roles, listStatus, pagination, loadRoles } = useRoles();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    const page = skip ? parseInt(skip) / parseInt(limit ?? '10') + 1 : 1;
    loadRoles({ page, limit: parseInt(limit ?? '10') });
  }, [skip, limit,  loadRoles]);

  useEffect(() => {
    loadRoles({ page: 1, limit: 10 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditDrawer = (roleId: number) => {
    setSelectedRoleId(roleId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedRoleId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadRoles({ page: 1, limit: 10 });
  };

  const handleViewDetails = (roleId: number) => {
    setSelectedDetailsRoleId(roleId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (roleId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedRoleId(roleId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IRole> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/roles',
    searchFields: ['name', 'description', 'branch.name'] as (keyof IRole)[],
    onSearch: (searchText: string) => {
      loadRoles({ page: 1, limit: 10, search: searchText });
    },
    onAdd: handleCreateDrawer,
    items: roles,
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
        title: t('description'),
        dataIndex: 'description',
        key: 'description',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('branch'),
        dataIndex: 'branch',
        key: 'branch',
        render: (branch: IBranch) => <span>{branch?.name || 'N/A'}</span>,
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
        render: (role: IRole) => (
          <EntityActions
            onView={() => router.push(`/roles/${role.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/roles/${role.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => {}}
            id={role.id}
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
          onRetry={() => loadRoles({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IRole>} />
        </AsyncErrorBoundary>

        <RoleFormDrawer
          mode={drawerMode}
          roleId={selectedRoleId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <RoleDetailsDrawer
          roleId={selectedDetailsRoleId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
