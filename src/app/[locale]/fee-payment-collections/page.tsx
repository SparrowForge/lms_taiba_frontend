'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import FeePaymentCollectionDetailsDrawer from '@/components/feePaymentCollections/FeePaymentCollectionDetailsDrawer';
import FeePaymentCollectionFormDrawer from '@/components/feePaymentCollections/FeePaymentCollectionFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections';
import { useLocalization } from '@/hooks/useLocalization';

import { IFeePaymentCollection } from '@/types/feePaymentCollection';

export default function FeePaymentCollectionsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
    defaultValue: 'Fee Payment Collection',
  });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const {
    feePaymentCollections,
    listStatus,
    pagination,
    loadFeePaymentCollections,
    removeFeePaymentCollection,
  } = useFeePaymentCollections();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadFeePaymentCollections({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadFeePaymentCollections({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadFeePaymentCollections]);

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
    loadFeePaymentCollections({ page: 1, limit: 10 });
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

  const config: EntityConfig<IFeePaymentCollection> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/fee-payment-collections',
    searchFields: ['transactionRef', 'paymentMode', 'status'] as (keyof IFeePaymentCollection)[],
    onSearch: (searchText: string) => {
      loadFeePaymentCollections({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: feePaymentCollections,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.STUDENT),
        dataIndex: 'student',
        key: 'student',
        render: (student: any) => (student ? `${student.firstName} ${student.lastName}` : 'N/A'),
      },
      {
        title: t(LOCALE_KEYS.AMOUNT_PAID, { defaultValue: 'Amount Paid' }),
        dataIndex: 'amountPaid',
        key: 'amountPaid',
        render: (amount: number, record: IFeePaymentCollection) =>
          `${record.currency} ${amount?.toLocaleString() || 'N/A'}`,
      },
      {
        title: t(LOCALE_KEYS.PAYMENT_MODE, { defaultValue: 'Payment Mode' }),
        dataIndex: 'paymentMode',
        key: 'paymentMode',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t(LOCALE_KEYS.PAYMENT_DATE, { defaultValue: 'Payment Date' }),
        dataIndex: 'paymentDate',
        key: 'paymentDate',
        render: (text: string) => new Date(text).toLocaleDateString(),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (item: IFeePaymentCollection) => (
          <EntityActions
            onView={() => router.push(`/fee-payment-collections/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/fee-payment-collections/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeFeePaymentCollection(item.id)}
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
          onRetry={() => loadFeePaymentCollections({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IFeePaymentCollection>} />
        </AsyncErrorBoundary>

        <FeePaymentCollectionFormDrawer
          mode={drawerMode}
          feePaymentCollectionId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <FeePaymentCollectionDetailsDrawer
          feePaymentCollectionId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
