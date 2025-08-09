'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import UserDetailsDrawer from '@/components/users/UserDetailsDrawer';
import UserFormDrawer from '@/components/users/UserFormModal';

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
  const t = useTranslations();
  const entityName = t('user');

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
    title: t('management_name', { name: entityName }),
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
        title: t('firstName'),
        dataIndex: 'firstName',
        key: 'firstName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('lastName'),
        dataIndex: 'lastName',
        key: 'lastName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('email'),
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('phone'),
        dataIndex: 'phone',
        key: 'phone',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('actions'),
        key: 'actions',
        width: 100,
        render: (user: IUser) => (
          <EntityActions
            onView={() => router.push(`/users/${user.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/users/${user.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
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
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
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
