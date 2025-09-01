'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import FeeInstallmentPlanDetailsDrawer from '@/components/feeInstallmentPlans/FeeInstallmentPlanDetailsDrawer';
import FeeInstallmentPlanFormDrawer from '@/components/feeInstallmentPlans/FeeInstallmentPlanFormDrawer';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IFeeInstallmentPlan} from '@/types/feeInstallmentPlan';

export default function FeeInstallmentPlansPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' });
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
     setDrawerVisible(false)
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
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
        title: t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' }),
        key: 'feeStructure',
        render: (feeInstallmentPlan: IFeeInstallmentPlan) => <span>{feeInstallmentPlan.feeStructure.templateName}</span>,
      },
      {
        title: t(LOCALE_KEYS.SEQUENCE_NO, { defaultValue: 'Sequence No' }),
        width: 120,
        dataIndex: 'sequenceNo',
        key: 'sequenceNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.PAYMENT_LABEL, { defaultValue: 'Payment Label' }),
        width: 140,
        dataIndex: 'paymentLabel',
        key: 'paymentLabel',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' }),
        dataIndex: ['semester', 'name'],
        key: 'semester',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.DURATION_MONTHS, { defaultValue: 'Duration (Months)' }),
        width: 100,
        dataIndex: 'durationMonths',
        key: 'durationMonths',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.AMOUNT, { defaultValue: 'Amount' }),
        width: 100,
        dataIndex: 'amount',
        key: 'amount',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.DISCOUNT_AMOUNT, { defaultValue: 'Discount Amount' }),
        width: 100,
        dataIndex: 'discountAmount',
        key: 'discountAmount',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.DUE_DATE, { defaultValue: 'Due Date' }),
        dataIndex: 'dueDate',
        key: 'dueDate',
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
        render: (feeInstallmentPlan: IFeeInstallmentPlan) => (
          <EntityActions
            onView={() =>
              router.push(`/fee-installment-plans/${feeInstallmentPlan.id}`)
            }
            onViewModal={() => handleViewDetails(feeInstallmentPlan.id)}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() =>
              router.push(`/fee-installment-plans/${feeInstallmentPlan.id}/edit`)
            }
            onEditModal={() => handleEditDrawer(feeInstallmentPlan.id)}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeFeeInstallmentPlan(feeInstallmentPlan.id)}
            id={feeInstallmentPlan.id}
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
