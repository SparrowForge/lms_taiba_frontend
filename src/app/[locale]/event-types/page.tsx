'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import EventTypeDetailsDrawer from '@/components/eventTypes/EventTypeDetailsDrawer';
import EventTypeFormDrawer from '@/components/eventTypes/EventTypeFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useEventTypes } from '@/hooks/useEventTypes';
import { useLocalization } from '@/hooks/useLocalization';

import { IEventType } from '@/types/eventType';
import { useTranslations } from 'next-intl';

export default function EventTypesPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.EVENT_TYPE, { defaultValue: 'Event Type' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsEventTypeId, setSelectedDetailsEventTypeId] = useState<
    number | undefined
  >();

  const { eventTypes, listStatus, pagination, loadEventTypes, removeEventType } = useEventTypes();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  const loadWithParams = (searchParams: URLSearchParams, skip: string | null, limit: string | null) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    loadEventTypes({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadEventTypes]);

  const handleEditDrawer = (id: number) => {
    setSelectedEventTypeId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedEventTypeId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadEventTypes({ page: 1, limit: 10 });
  };

  const handleViewDetails = (id: number) => {
    setSelectedDetailsEventTypeId(id);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (id: number) => {
    setDetailsDrawerVisible(false);
    setSelectedEventTypeId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IEventType> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/event-types',
    searchFields: ['name', 'color'] as (keyof IEventType)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadEventTypes({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: eventTypes,
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
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
        render: (value: string) => (
          <span>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: value,
                marginRight: 8,
                border: '1px solid #ddd',
              }}
            />
            {value}
          </span>
        ),
      },
      {
        title: 'Sort Order',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        render: (text: number) => <span>{text}</span>,
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
        render: (item: IEventType) => (
          <EntityActions
            onView={() => router.push(`/event-types/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/event-types/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeEventType(item.id)}
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
          onRetry={() => loadEventTypes({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IEventType>} />
        </AsyncErrorBoundary>

        <EventTypeFormDrawer
          mode={drawerMode}
          eventTypeId={selectedEventTypeId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <EventTypeDetailsDrawer
          eventTypeId={selectedDetailsEventTypeId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}

