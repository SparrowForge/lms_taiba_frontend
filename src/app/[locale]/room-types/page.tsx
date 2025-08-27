'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import RoomTypeDetailsDrawer from '@/components/roomTypes/RoomTypeDetailsDrawer';
import RoomTypeFormDrawer from '@/components/roomTypes/RoomTypeFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoomTypes} from '@/hooks/useRoomTypes';

import {Status} from '@/types/common';
import {IRoomType} from '@/types/roomType';


export default function RoomTypesPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const { roomTypes, listStatus, pagination, loadRoomTypes, removeRoomType } =
    useRoomTypes();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadRoomTypes({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadRoomTypes({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadRoomTypes]);

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
    loadRoomTypes({ page: 1, limit: 10 });
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

  const config: EntityConfig<IRoomType> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/room-types',
    searchFields: ['name', 'status'] as (keyof IRoomType)[],
    onSearch: (searchText: string) => {
      loadRoomTypes({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: roomTypes,
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
        render: (item: IRoomType) => (
          <EntityActions
            onView={() => router.push(`/room-types/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/room-types/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeRoomType(item.id)}
            id={item.id}
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
          onRetry={() => loadRoomTypes({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IRoomType>} />
        </AsyncErrorBoundary>

        <RoomTypeFormDrawer
          mode={drawerMode}
          roomTypeId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <RoomTypeDetailsDrawer
          roomTypeId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
