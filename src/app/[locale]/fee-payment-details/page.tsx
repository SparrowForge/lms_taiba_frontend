'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import FeePaymentDetailsDetailsDrawer from '@/components/feePaymentDetails/FeePaymentDetailsDetailsDrawer';
import FeePaymentDetailsFormDrawer from '@/components/feePaymentDetails/FeePaymentDetailsFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useFeePaymentDetails } from '@/hooks/useFeePaymentDetails';
import { useLocalization } from '@/hooks/useLocalization';

import { IFeePaymentDetails } from '@/types/feePaymentDetails';

export default function FeePaymentDetailsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const {
    feePaymentDetails,
    listStatus,
    pagination,
    loadFeePaymentDetails,
    removeFeePaymentDetail,
  } = useFeePaymentDetails();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadFeePaymentDetails({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadFeePaymentDetails({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadFeePaymentDetails]);

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
    setDrawerVisible(false);
    loadFeePaymentDetails({ page: 1, limit: 10 });
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

  const config: EntityConfig<IFeePaymentDetails> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/fee-payment-details',
    searchFields: ['feeTitle', 'paymentId'] as (keyof IFeePaymentDetails)[],
    onSearch: (searchText: string) => {
      loadFeePaymentDetails({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: feePaymentDetails,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.FEE_TITLE, { defaultValue: 'Fee Title' }),
        dataIndex: 'feeTitle',
        key: 'feeTitle',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.AMOUNT_DUE, { defaultValue: 'Amount Due' }),
        dataIndex: 'amountDue',
        key: 'amountDue',
        render: (amount: number) => amount?.toLocaleString() || 'N/A',
      },
      {
        title: t(LOCALE_KEYS.AMOUNT_PAID),
        dataIndex: 'amountPaid',
        key: 'amountPaid',
        render: (amount: number) => amount?.toLocaleString() || 'N/A',
      },
      {
        title: t(LOCALE_KEYS.BALANCE_AMOUNT, { defaultValue: 'Balance Amount' }),
        dataIndex: 'balanceAmount',
        key: 'balanceAmount',
        render: (amount: number) => amount?.toLocaleString() || 'N/A',
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
        render: (item: IFeePaymentDetails) => (
          <EntityActions
            onView={() => router.push(`/fee-payment-details/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/fee-payment-details/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeFeePaymentDetail(item.id)}
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
          onRetry={() => loadFeePaymentDetails({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IFeePaymentDetails>} />
        </AsyncErrorBoundary>

        <FeePaymentDetailsFormDrawer
          mode={drawerMode}
          feePaymentDetailId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <FeePaymentDetailsDetailsDrawer
          feePaymentDetailId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
