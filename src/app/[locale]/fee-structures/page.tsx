'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import FeeStructureDetailsDrawer from '@/components/feeStructures/FeeStructureDetailsDrawer';
import FeeStructureFormDrawer from '@/components/feeStructures/FeeStructureFormDrawer';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useFeeStructures} from '@/hooks/useFeeStructures';

import {Status} from '@/types/common';
import {IFeeStructure} from '@/types/feeStructure';
import {IBatch} from '@/types/batch';
import {ISemester} from '@/types/semester';


export default function FeeStructuresPage() {
  const t = useTranslations();
  const entityName = t('feeStructure', { defaultValue: 'Fee Structure' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsFeeStructureId, setSelectedDetailsFeeStructureId] = useState<number | undefined>();

  const { feeStructures, listStatus, pagination, loadFeeStructures, removeFeeStructure } = useFeeStructures();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadFeeStructures({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadFeeStructures({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadFeeStructures]);

  const handleEditDrawer = (feeStructureId: number) => {
    setSelectedFeeStructureId(feeStructureId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedFeeStructureId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadFeeStructures({ page: 1, limit: 10 });
  };

  const handleViewDetails = (feeStructureId: number) => {
    setSelectedDetailsFeeStructureId(feeStructureId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (feeStructureId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedFeeStructureId(feeStructureId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IFeeStructure> = {
    name: entityName,
    title: t('management_name', { name: entityName }),
    route: '/fee-structures',
    searchFields: ['template_name', 'academic_year', 'batch.name', 'semester.name'] as (keyof IFeeStructure)[],
    onSearch: (searchText: string) => {
      loadFeeStructures({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: feeStructures,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('templateName'),
        dataIndex: 'template_name',
        key: 'template_name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('batch'),
        dataIndex: 'batch',
        key: 'batch',
        render: (batch: IBatch) => <span>{batch?.name || 'N/A'}</span>,
      },
      {
        title: t('semester'),
        dataIndex: 'semester',
        key: 'semester',
        render: (semester: ISemester) => <span>{semester?.name || 'N/A'}</span>,
      },
      {
        title: t('academicYear'),
        dataIndex: 'academic_year',
        key: 'academic_year',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('paymentType'),
        dataIndex: 'payment_type',
        key: 'payment_type',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('totalFees'),
        dataIndex: 'total_fees',
        key: 'total_fees',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('currency'),
        dataIndex: 'currency',
        key: 'currency',
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
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t('actions'),
        key: 'actions',
        width: 100,
        render: (feeStructure: IFeeStructure) => (
          <EntityActions
            onView={() => router.push(`/fee-structures/${feeStructure.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/fee-structures/${feeStructure.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeFeeStructure(feeStructure.id)}
            id={feeStructure.id}
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
          onRetry={() => loadFeeStructures({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IFeeStructure>} />
        </AsyncErrorBoundary>

        <FeeStructureFormDrawer
          mode={drawerMode}
          feeStructureId={selectedFeeStructureId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <FeeStructureDetailsDrawer
          feeStructureId={selectedDetailsFeeStructureId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
