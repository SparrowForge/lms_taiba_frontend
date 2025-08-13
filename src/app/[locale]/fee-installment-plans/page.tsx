'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import FeeInstallmentPlanDetailsDrawer from '@/components/feeInstallmentPlans/FeeInstallmentPlanDetailsDrawer';
import FeeInstallmentPlanFormDrawer from '@/components/feeInstallmentPlans/FeeInstallmentPlanFormDrawer';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';

import {Status} from '@/types/common';
import {IFeeInstallmentPlan} from '@/types/feeInstallmentPlan';

export default function FeeInstallmentPlansPage() {
  const t = useTranslations();
  const entityName = t('feeInstallmentPlan', { defaultValue: 'Fee Installment Plan' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const {
    feeInstallmentPlans,
    listStatus,
    pagination,
    loadFeeInstallmentPlans,
    removeFeeInstallmentPlan,
  } = useFeeInstallmentPlans();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadFeeInstallmentPlans({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadFeeInstallmentPlans({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadFeeInstallmentPlans]);

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
    loadFeeInstallmentPlans({ page: 1, limit: 10 });
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

  const config: EntityConfig<IFeeInstallmentPlan> = {
    name: entityName,
    title: t('management_name', { name: entityName }),
    route: '/fee-installment-plans',
    searchFields: [] as (keyof IFeeInstallmentPlan)[],
    onSearch: (searchText: string) => {
      loadFeeInstallmentPlans({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: feeInstallmentPlans,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('fee_structure', { defaultValue: 'Fee Structure' }),
        key: 'feeStructure',
        render: (feeInstallmentPlan: IFeeInstallmentPlan) => <span>{feeInstallmentPlan.feeStructure.templateName}</span>,
      },
      {
        title: t('sequence_no', { defaultValue: 'Sequence No' }),
        dataIndex: 'sequenceNo',
        key: 'sequenceNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('payment_label', { defaultValue: 'Payment Label' }),
        dataIndex: 'paymentLabel',
        key: 'paymentLabel',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('semester', { defaultValue: 'Semester' }),
        dataIndex: ['semester', 'name'],
        key: 'semester',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('duration_months', { defaultValue: 'Duration (Months)' }),
        dataIndex: 'durationMonths',
        key: 'durationMonths',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('amount', { defaultValue: 'Amount' }),
        dataIndex: 'amount',
        key: 'amount',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('discount_amount', { defaultValue: 'Discount Amount' }),
        dataIndex: 'discountAmount',
        key: 'discountAmount',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('due_date', { defaultValue: 'Due Date' }),
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('created_at', { defaultValue: 'Created At' }),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t('actions'),
        key: 'actions',
        width: 100,
        render: (feeInstallmentPlan: IFeeInstallmentPlan) => (
          <EntityActions
            onView={() =>
              router.push(`/fee-installment-plans/${feeInstallmentPlan.id}`)
            }
            onViewModal={() => handleViewDetails(feeInstallmentPlan.id)}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() =>
              router.push(`/fee-installment-plans/${feeInstallmentPlan.id}/edit`)
            }
            onEditModal={() => handleEditDrawer(feeInstallmentPlan.id)}
            editModalText={t('quickEdit')}
            onDelete={() => removeFeeInstallmentPlan(feeInstallmentPlan.id)}
            id={feeInstallmentPlan.id}
          />
        ),
      },
    ],
  };

  console.log(feeInstallmentPlans);

  return (
    <ProtectedRoute>
      <MainLayout>
        <AsyncErrorBoundary
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
              : null
          }
          onRetry={() => loadFeeInstallmentPlans({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IFeeInstallmentPlan>} />
        </AsyncErrorBoundary>

        <FeeInstallmentPlanFormDrawer
          mode={drawerMode}
          feeInstallmentPlanId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <FeeInstallmentPlanDetailsDrawer
          feeInstallmentPlanId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
