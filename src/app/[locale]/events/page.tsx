'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import EventDetailsDrawer from '@/components/events/EventDetailsDrawer';
import EventFormDrawer from '@/components/events/EventFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useEvents } from '@/hooks/useEvents';
import { useLocalization } from '@/hooks/useLocalization';

import { IEvent } from '@/types/event';

export default function EventsPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.EVENT, { defaultValue: 'Event' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsEventId, setSelectedDetailsEventId] = useState<number | undefined>();

  const { events, listStatus, pagination, loadEvents, removeEvent } = useEvents();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  const loadWithParams = (searchParams: URLSearchParams, skip: string | null, limit: string | null) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    loadEvents({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadEvents]);

  const handleEditDrawer = (id: number) => {
    setSelectedEventId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedEventId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadEvents({ page: 1, limit: 10 });
  };

  const handleViewDetails = (id: number) => {
    setSelectedDetailsEventId(id);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (id: number) => {
    setDetailsDrawerVisible(false);
    setSelectedEventId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IEvent> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/events',
    searchFields: ['name'] as (keyof IEvent)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadEvents({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: events,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    filters: [
      {
        key: 'status',
        label: t(LOCALE_KEYS.STATUS),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...ENTITY_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
        ],
      },
    ],
    columns: [
      {
        title: t(LOCALE_KEYS.NAME),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.ACADEMIC_YEAR),
        dataIndex: 'academicYear',
        key: 'academicYear',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: 'Start At',
        dataIndex: 'startAt',
        key: 'startAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: 'End At',
        dataIndex: 'endAt',
        key: 'endAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <span>{text}</span>,
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
        render: (item: IEvent) => (
          <EntityActions
            onView={() => router.push(`/events/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/events/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeEvent(item.id)}
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
          onRetry={() => loadEvents({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IEvent>} />
        </AsyncErrorBoundary>

        <EventFormDrawer
          mode={drawerMode}
          eventId={selectedEventId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <EventDetailsDrawer
          eventId={selectedDetailsEventId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}

