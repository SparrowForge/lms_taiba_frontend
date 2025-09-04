'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import ClassScheduleDetailsDrawer from '@/components/classSchedules/ClassScheduleDetailsDrawer';
import ClassScheduleFormDrawer from '@/components/classSchedules/ClassScheduleFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useClassSchedules} from '@/hooks/useClassSchedules';
import {useLocalization} from '@/hooks/useLocalization';

import {IClassSchedule} from '@/types/classSchedule';
import {Status} from '@/types/common';

export default function ClassScheduleListView() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const { classSchedules, listStatus, pagination, loadClassSchedules, removeClassSchedule } =
    useClassSchedules();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadClassSchedules({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadClassSchedules({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadClassSchedules]);

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
    loadClassSchedules({ page: 1, limit: 10 });
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

  const config: EntityConfig<IClassSchedule> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/class-schedules',
    searchFields: ['status'] as (keyof IClassSchedule)[],
    onSearch: (searchText: string) => {
      loadClassSchedules({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: classSchedules,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.SUBJECT),
        dataIndex: 'subject.name',
        key: 'subject',
        render: (_, record) => <span>{record.subject?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.BATCH),
        dataIndex: 'batch.name',
        key: 'batch',
        render: (_, record) => <span>{record.batch?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.WEEK_DAY),
        dataIndex: 'weekDay.name',
        key: 'weekDay',
        render: (_, record) => <span>{record.weekDay?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.TIME_SLOT),
        dataIndex: 'timeSlot.name',
        key: 'timeSlot',
        render: (_, record) => <span>{record.timeSlot?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.ROOM),
        dataIndex: 'room.name',
        key: 'room',
        render: (_, record) => <span>{record.room?.name || 'N/A'}</span>,
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
        render: (item: IClassSchedule) => (
          <EntityActions
            onView={() => router.push(`/class-schedules/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/class-schedules/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeClassSchedule(item.id)}
            id={item.id}
          />
        ),
      },
    ],
  };

  return (
    <>
      <AsyncErrorBoundary
        error={
          listStatus.status === Status.FAILED
            ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
            : null
        }
        onRetry={() => loadClassSchedules({ page: 1, limit: 10 })}
      >
        <EntityList config={config as EntityConfig<IClassSchedule>} />
      </AsyncErrorBoundary>

      <ClassScheduleFormDrawer
        mode={drawerMode}
        classScheduleId={selectedId}
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        onSuccess={handleDrawerSuccess}
      />

      <ClassScheduleDetailsDrawer
        classScheduleId={selectedDetailsId}
        visible={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={handleDetailsEdit}
      />
    </>
  );
}
