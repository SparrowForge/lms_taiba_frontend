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
import WeekDayDetailsDrawer from '@/components/weekDays/WeekDayDetailsDrawer';
import WeekDayFormDrawer from '@/components/weekDays/WeekDayFormDrawer';

import {useLocalization} from '@/hooks/useLocalization';
import {useWeekDays} from '@/hooks/useWeekDays';

import {Status} from '@/types/common';
import {IWeekDay} from '@/types/weekDay';


export default function WeekDaysPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const { weekDays, listStatus, pagination, loadWeekDays, removeWeekDay } =
    useWeekDays();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadWeekDays({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadWeekDays({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadWeekDays]);

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
    loadWeekDays({ page: 1, limit: 10 });
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

  const config: EntityConfig<IWeekDay> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/week-days',
    searchFields: ['name', 'status'] as (keyof IWeekDay)[],
    onSearch: (searchText: string) => {
      loadWeekDays({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: weekDays,
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
        title: t(LOCALE_KEYS.DAY_NUMBER),
        width: 130,
        dataIndex: 'dayNumber',
        key: 'dayNumber',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.IS_WORKING_DAY),
        width: 140,
        dataIndex: 'isWorkingDay',
        key: 'isWorkingDay',
        render: (text: boolean) => <span>{text ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)}</span>,
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
        render: (item: IWeekDay) => (
          <EntityActions
            onView={() => router.push(`/week-days/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/week-days/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeWeekDay(item.id)}
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
          onRetry={() => loadWeekDays({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IWeekDay>} />
        </AsyncErrorBoundary>

        <WeekDayFormDrawer
          mode={drawerMode}
          weekDayId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <WeekDayDetailsDrawer
          weekDayId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
