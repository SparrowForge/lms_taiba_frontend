'use client';

import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import UserRoleDetailsDrawer from '@/components/userRoles/UserRoleDetailsDrawer';
import UserRoleFormDrawer from '@/components/userRoles/UserRoleFormDrawer';

import { useLocalization } from '@/hooks/useLocalization';
import { useUserRoles } from '@/hooks/useUserRoles';

import { IUserRole } from '@/types/userRole';

export default function UserRolesPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.USER_ROLE, { defaultValue: 'User Role' });
  const { userRoles, listStatus, pagination, loadUserRoles, removeUserRole } = useUserRoles();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedUserRoleId, setSelectedUserRoleId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsUserRoleId, setSelectedDetailsUserRoleId] = useState<number | null>(null);

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadUserRoles({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadUserRoles({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadUserRoles]);

  const handleCreateDrawer = () => {
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/user-roles',
    searchFields: ['userId', 'roleId'] as (keyof IUserRole)[],
    onSearch: (searchText: string) => {
      loadUserRoles({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
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
        title: t(LOCALE_KEYS.USER),
        key: 'user',
        render: (userRole: IUserRole) =>
          userRole.user ? `${userRole.user.firstName} ${userRole.user.lastName}` : 'N/A',
      },
      {
        title: t(LOCALE_KEYS.EMAIL),
        key: 'email',
        render: (userRole: IUserRole) => userRole.user?.email || 'N/A',
      },
      {
        title: t(LOCALE_KEYS.ROLE),
        key: 'role',
        render: (userRole: IUserRole) => userRole.role?.name || 'N/A',
      },
      {
        title: t(LOCALE_KEYS.DESCRIPTION),
        key: 'description',
        render: (userRole: IUserRole) => userRole.role?.description || 'N/A',
      },
      {
        title: t(LOCALE_KEYS.CREATED_AT),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => dayjs(text).format('DD-MM-YYYY HH:mm'),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (userRole: IUserRole) => (
          <EntityActions
            onView={() => router.push(`/user-roles/${userRole.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/user-roles/${userRole.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
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
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
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
