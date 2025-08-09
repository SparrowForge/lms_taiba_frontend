'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import ScheduleTypeDetailsDrawer from '@/components/scheduleTypes/ScheduleTypeDetailsDrawer';
import ScheduleTypeFormDrawer from '@/components/scheduleTypes/ScheduleTypeFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';
import {IScheduleType} from '@/types/scheduleType';


export default function ScheduleTypesPage() {
  const t = useTranslations();
  const entityName = t('scheduleType', { defaultValue: 'Schedule Type' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const { scheduleTypes, listStatus, pagination, loadScheduleTypes, removeScheduleType } =
    useScheduleTypes();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadScheduleTypes({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadScheduleTypes({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadScheduleTypes]);

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
    loadScheduleTypes({ page: 1, limit: 10 });
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

  const config: EntityConfig<IScheduleType> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/schedule-types',
    searchFields: ['name', 'status'] as (keyof IScheduleType)[],
    onSearch: (searchText: string) => {
      loadScheduleTypes({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: scheduleTypes,
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
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <span>{text}</span>,
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
        render: (item: IScheduleType) => (
          <EntityActions
            onView={() => router.push(`/schedule-types/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/schedule-types/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeScheduleType(item.id)}
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
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
              : null
          }
          onRetry={() => loadScheduleTypes({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IScheduleType>} />
        </AsyncErrorBoundary>

        <ScheduleTypeFormDrawer
          mode={drawerMode}
          scheduleTypeId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <ScheduleTypeDetailsDrawer
          scheduleTypeId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
