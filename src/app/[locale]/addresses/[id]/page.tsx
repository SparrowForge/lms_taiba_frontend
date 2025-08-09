'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useCreateAddressDetailsConfig} from '@/components/addresses/addressConfig';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useAddresses} from '@/hooks/useAddresses';

import {IAddress} from '@/types/address';
import {Status} from '@/types/common';


interface AddressDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const AddressDetailPage: React.FC<AddressDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { addresses, listStatus, loadAddresses, getAddressById, loadAddress } = useAddresses();
  const [address, setAddress] = useState<IAddress | null>(null);
  const t = useTranslations();
  const entityName = t('address');

  useEffect(() => {
    const addressId = parseInt(resolvedParams.id);
    const found = getAddressById(addressId);
    if (found) {
      setAddress(found);
    } else {
      loadAddress(addressId);
    }
  }, [resolvedParams.id, getAddressById, loadAddress]);

  useEffect(() => {
    if (addresses.length === 0) {
      loadAddresses();
    }
  }, [addresses.length, loadAddresses]);

  useEffect(() => {
    if (addresses.length > 0) {
      const found = getAddressById(parseInt(resolvedParams.id));
      if (found) {
        setAddress(found);
      }
    }
  }, [addresses, resolvedParams.id, getAddressById]);

  const config = useCreateAddressDetailsConfig(
    address,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IAddress>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AddressDetailPage;
