'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BatchDetailsDrawer from '@/components/batches/BatchDetailsDrawer';
import BatchFormDrawer from '@/components/batches/BatchFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useBatches} from '@/hooks/useBatches';
import {useLocalization} from '@/hooks/useLocalization';

import {IBatch} from '@/types/batch';
import {Status} from '@/types/common';
import {ICourse} from '@/types/course';

export default function BatchesPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedBatchId, setSelectedBatchId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsBatchId, setSelectedDetailsBatchId] = useState<number | undefined>();

  const { batches, listStatus, pagination, loadBatches, removeBatch } = useBatches();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadBatches({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadBatches({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadBatches]);

  const handleEditDrawer = (batchId: number) => {
    setSelectedBatchId(batchId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedBatchId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

   const handleDrawerSuccess = () => {
     setDrawerVisible(false)
    loadBatches({ page: 1, limit: 10 });
  };

  const handleViewDetails = (batchId: number) => {
    setSelectedDetailsBatchId(batchId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (batchId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedBatchId(batchId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IBatch> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/batches',
    searchFields: ['name', 'year', 'session'] as (keyof IBatch)[],
    onSearch: (searchText: string) => {
      loadBatches({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: batches,
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
        title: t(LOCALE_KEYS.START_DATE),
        dataIndex: 'startDate',
        key: 'startDate',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.END_DATE),
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.YEAR),
        dataIndex: 'year',
        key: 'year',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.SESSION),
        dataIndex: 'session',
        key: 'session',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.INTAKE_CAPACITY),
        width: 100,
        dataIndex: 'intakeCapacity',
        key: 'intakeCapacity',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t(LOCALE_KEYS.REMARKS),
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('course'),
        dataIndex: 'course',
        key: 'course',
        render: (course: ICourse) => <span>{course?.name || 'N/A'}</span>,
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
        render: (batch: IBatch) => (
          <EntityActions
            onView={() => router.push(`/batches/${batch.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/batches/${batch.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeBatch(batch.id)}
            id={batch.id}
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
          onRetry={() => loadBatches({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IBatch>} />
        </AsyncErrorBoundary>

        <BatchFormDrawer
          mode={drawerMode}
          batchId={selectedBatchId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <BatchDetailsDrawer
          batchId={selectedDetailsBatchId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
