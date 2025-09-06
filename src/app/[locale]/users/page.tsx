'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';
import UserDetailsDrawer from '@/components/users/UserDetailsDrawer';
import UserFormDrawer from '@/components/users/UserFormDrawer';

import {useLocalization} from '@/hooks/useLocalization';
import {useUsers} from '@/hooks/useUsers';

import {Status} from '@/types/common';
import {IUser} from '@/types/user';

export default function UsersPage() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsUserId, setSelectedDetailsUserId] = useState<number | undefined>();

  const { users, listStatus, pagination, loadUsers, removeUser } = useUsers();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER, { defaultValue: 'User' });

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadUsers({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadUsers({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadUsers]);

  const handleEditDrawer = (userId: number) => {
    setSelectedUserId(userId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedUserId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadUsers({ page: 1, limit: 10 }); // Refresh the list
  };

  const handleViewDetails = (userId: number) => {
    setSelectedDetailsUserId(userId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (userId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedUserId(userId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IUser> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/users',
    exportUrl: '/users/export',
    searchFields: ['name', 'email'] as (keyof IUser)[],
    onSearch: (searchText: string) => {
      loadUsers({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: users,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.FIRST_NAME),
        dataIndex: 'firstName',
        key: 'firstName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.LAST_NAME),
        dataIndex: 'lastName',
        key: 'lastName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.EMAIL),
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.PHONE),
        dataIndex: 'phone',
        key: 'phone',
        render: (text: string) => <span>{text}</span>,
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
        render: (user: IUser) => (
          <EntityActions
            onView={() => router.push(`/users/${user.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/users/${user.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeUser(user.id)}
            id={user.id}
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
          onRetry={() => loadUsers({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IUser>} />
        </AsyncErrorBoundary>

        <UserFormDrawer
          mode={drawerMode}
          userId={selectedUserId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <UserDetailsDrawer
          userId={selectedDetailsUserId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
