'use client';

import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';


import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import UserRoleDetailsDrawer from '@/components/userRoles/UserRoleDetailsDrawer';
import UserRoleFormDrawer from '@/components/userRoles/UserRoleFormDrawer';

import {useUserRoles} from '@/hooks/useUserRoles';

import {Status} from '@/types/common';
import {IUserRole} from '@/types/userRole';

export default function UserRolesPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('userRole');
  const { userRoles, listStatus, pagination, loadUserRoles, removeUserRole } = useUserRoles();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedUserRoleId, setSelectedUserRoleId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsUserRoleId, setSelectedDetailsUserRoleId] = useState<number | null>(null);

  useEffect(() => {
    loadUserRoles({ page: 1, limit: 10 });
  }, [loadUserRoles]);

  const handleCreate = () => {
    setDrawerMode('create');
    setSelectedUserRoleId(undefined);
    setDrawerVisible(true);
  };

  const handleEditDrawer = (userRoleId: number) => {
    setDrawerMode('edit');
    setSelectedUserRoleId(userRoleId);
    setDrawerVisible(true);
  };

  const handleViewDetails = (userRoleId: number) => {
    setSelectedDetailsUserRoleId(userRoleId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (userRoleId: number) => {
    setDetailsDrawerVisible(false);
    setDrawerMode('edit');
    setSelectedUserRoleId(userRoleId);
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadUserRoles({ page: 1, limit: 10 });
  };

  const config: EntityConfig<IUserRole> = {
    name: entityName,
    title: t('management_name', { name: entityName }),
    route: '/user-roles',
    searchFields: ['userId', 'roleId'] as (keyof IUserRole)[],
    onSearch: (searchText: string) => {
      loadUserRoles({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreate,
    items: userRoles,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: t('user'),
        key: 'user',
        render: (userRole: IUserRole) =>
          userRole.user ? `${userRole.user.firstName} ${userRole.user.lastName}` : 'N/A',
      },
      {
        title: t('email'),
        key: 'email',
        render: (userRole: IUserRole) => userRole.user?.email || 'N/A',
      },
      {
        title: t('role'),
        key: 'role',
        render: (userRole: IUserRole) => userRole.role?.name || 'N/A',
      },
      {
        title: t('description'),
        key: 'description',
        render: (userRole: IUserRole) => userRole.role?.description || 'N/A',
      },
      {
        title: t('createdAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => dayjs(text).format('DD-MM-YYYY HH:mm'),
      },
      {
        title: t('actions'),
        key: 'actions',
        width: 100,
        render: (userRole: IUserRole) => (
          <EntityActions
            onView={() => router.push(`/user-roles/${userRole.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/user-roles/${userRole.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeUserRole(userRole.id)}
            id={userRole.id}
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
          onRetry={() => loadUserRoles({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IUserRole>} />
        </AsyncErrorBoundary>

        <UserRoleFormDrawer
          mode={drawerMode}
          userRoleId={selectedUserRoleId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <UserRoleDetailsDrawer
          userRoleId={selectedDetailsUserRoleId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
