'use client';

import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import {IBatch} from '@/types/batch';
import {useBatches} from '@/hooks/useBatches';
import {useEffect, useState} from 'react';
import {Status} from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRouter, useSearchParams} from 'next/navigation';
import BatchFormDrawer from '@/components/batches/BatchFormDrawer';
import BatchDetailsDrawer from '@/components/batches/BatchDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {useTranslations} from 'next-intl';
import {ICourse} from "@/types/course";

export default function BatchesPage() {
  const t = useTranslations();
  const entityName = t('batch', { defaultValue: 'Batch' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedBatchId, setSelectedBatchId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsBatchId, setSelectedDetailsBatchId] = useState<number | undefined>();

  const { batches, listStatus, pagination, loadBatches } = useBatches();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    const page = skip ? parseInt(skip) / parseInt(limit ?? '10') + 1 : 1;
    loadBatches({ page, limit: parseInt(limit ?? '10') });
  }, [skip, limit,  loadBatches]);

  useEffect(() => {
    loadBatches({ page: 1, limit: 10 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    title: t('managemen_name', { name: entityName }),
    route: '/batches',
    searchFields: ['name', 'year', 'session'] as (keyof IBatch)[],
    onSearch: (searchText: string) => {
      loadBatches({ page: 1, limit: 10, search: searchText });
    },
    onAdd: handleCreateDrawer,
    items: batches,
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
        title: t('year'),
        dataIndex: 'year',
        key: 'year',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('session'),
        dataIndex: 'session',
        key: 'session',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('intakeCapacity'),
        dataIndex: 'intakeCapacity',
        key: 'intakeCapacity',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('course'),
        dataIndex: 'course',
        key: 'course',
        render: (course: ICourse) => <span>{course?.name || 'N/A'}</span>,
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
        render: (batch: IBatch) => (
          <EntityActions
            onView={() => router.push(`/batches/${batch.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/batches/${batch.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => {}}
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
          error={listStatus.status === Status.FAILED ? new Error(listStatus.message || t('failed_name', { name: entityName })) : null}
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
