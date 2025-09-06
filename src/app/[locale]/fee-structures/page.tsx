'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import FeeStructureDetailsDrawer from '@/components/feeStructures/FeeStructureDetailsDrawer';
import FeeStructureFormDrawer from '@/components/feeStructures/FeeStructureFormDrawer';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useLocalization} from '@/hooks/useLocalization';

import {IBatch} from '@/types/batch';
import {Status} from '@/types/common';
import {IFeeStructure} from '@/types/feeStructure';
import {ISemester} from '@/types/semester';

export default function FeeStructuresPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsFeeStructureId, setSelectedDetailsFeeStructureId] = useState<
    number | undefined
  >();

  const { feeStructures, listStatus, pagination, loadFeeStructures, removeFeeStructure } =
    useFeeStructures();

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
    setDrawerVisible(false);
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/fee-structures',
    searchFields: [
      'templateName',
      'academicYear',
      'batch.name',
      'semester.name',
    ] as (keyof IFeeStructure)[],
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
        title: t(LOCALE_KEYS.TEMPLATE_NAME, { defaultValue: 'Template Name' }),
        dataIndex: 'templateName',
        key: 'templateName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' }),
        dataIndex: 'batch',
        key: 'batch',
        render: (batch: IBatch) => <span>{batch?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' }),
        dataIndex: 'semester',
        key: 'semester',
        render: (semester: ISemester) => <span>{semester?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.ACADEMIC_YEAR, { defaultValue: 'Academic Year' }),
        dataIndex: 'academicYear',
        key: 'academicYear',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.PAYMENT_TYPE, { defaultValue: 'Payment Type' }),
        dataIndex: 'paymentType',
        key: 'paymentType',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.TOTAL_FEES, { defaultValue: 'Total Fees' }),
        dataIndex: 'totalFees',
        key: 'totalFees',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.CURRENCY),
        dataIndex: 'currency',
        key: 'currency',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.CREATED_AT, { defaultValue: 'Created At' }),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (feeStructure: IFeeStructure) => (
          <EntityActions
            onView={() => router.push(`/fee-structures/${feeStructure.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/fee-structures/${feeStructure.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
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
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
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
