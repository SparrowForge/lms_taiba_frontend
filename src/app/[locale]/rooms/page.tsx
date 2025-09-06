'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import RoomDetailsDrawer from '@/components/rooms/RoomDetailsDrawer';
import RoomFormDrawer from '@/components/rooms/RoomFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useLocalization} from '@/hooks/useLocalization';
import {useRooms} from '@/hooks/useRooms';

import {IRoom} from '@/types/room';

export default function RoomsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM, { defaultValue: 'Room' });
  const router = useRouter();

  // State management
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  // Data and operations
  const { rooms, listStatus, pagination, loadRooms, removeRoom } = useRooms();

  // URL parameter handling
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadRooms({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadRooms({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadRooms]);

  // Handler functions
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
    setDrawerVisible(false);
    loadRooms({ page: 1, limit: 10 });
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

  // Entity configuration
  const config: EntityConfig<IRoom> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/rooms',
    searchFields: ['name', 'levelFloor', 'status'] as (keyof IRoom)[],
    onSearch: (searchText: string) => {
      loadRooms({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: rooms,
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
        title: t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' }),
        key: 'roomType',
        render: (roomType: IRoom) => <span>{roomType?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.LEVEL_FLOOR, { defaultValue: 'Level/Floor' }),
        dataIndex: 'levelFloor',
        key: 'levelFloor',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.SITTING_CAPACITY, { defaultValue: 'Sitting Capacity' }),
        dataIndex: 'sittingCapacity',
        key: 'sittingCapacity',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.EXAM_CAPACITY, { defaultValue: 'Exam Capacity' }),
        dataIndex: 'examCapacity',
        key: 'examCapacity',
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
        render: (item: IRoom) => (
          <EntityActions
            onView={() => router.push(`/rooms/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/rooms/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeRoom(item.id)}
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
          onRetry={() => loadRooms({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IRoom>} />
        </AsyncErrorBoundary>

        <RoomFormDrawer
          mode={drawerMode}
          roomId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <RoomDetailsDrawer
          roomId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
