'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import AddressDetailsDrawer from '@/components/addresses/AddressDetailsDrawer';
import AddressFormDrawer from '@/components/addresses/AddressFormDrawer';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useAddresses} from '@/hooks/useAddresses';

import {IAddress} from '@/types/address';
import {Status} from '@/types/common';


export default function AddressesPage() {
  const t = useTranslations();
  const entityName = t('address', { defaultValue: 'Address' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsAddressId, setSelectedDetailsAddressId] = useState<number | undefined>();

  const { addresses, listStatus, pagination, loadAddresses, removeAddress } = useAddresses();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadAddresses({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadAddresses({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadAddresses]);

  const handleEditDrawer = (addressId: number) => {
    setSelectedAddressId(addressId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedAddressId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadAddresses({ page: 1, limit: 10 });
  };

  const handleViewDetails = (addressId: number) => {
    setSelectedDetailsAddressId(addressId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (addressId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedAddressId(addressId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IAddress> = {
    name: entityName,
    title: t('management_name', { name: entityName }),
    route: '/addresses',
    searchFields: ['name', 'city', 'state'] as (keyof IAddress)[],
    onSearch: (searchText: string) => {
      loadAddresses({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: addresses,
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
        title: t('address'),
        dataIndex: 'address',
        key: 'address',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('city'),
        dataIndex: 'city',
        key: 'city',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('state'),
        dataIndex: 'state',
        key: 'state',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('country'),
        dataIndex: 'country',
        key: 'country',
        render: (text: string) => <span>{text}</span>,
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
        render: (address: IAddress) => (
          <EntityActions
            onView={() => router.push(`/addresses/${address.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/addresses/${address.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeAddress(address.id)}
            id={address.id}
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
          onRetry={() => loadAddresses({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IAddress>} />
        </AsyncErrorBoundary>

        <AddressFormDrawer
          mode={drawerMode}
          addressId={selectedAddressId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <AddressDetailsDrawer
          addressId={selectedDetailsAddressId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
