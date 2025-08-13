'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useCreateAddressDetailsConfig} from '@/components/addresses/addressConfig';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useAddresses} from '@/hooks/useAddresses';

import {IAddress} from '@/types/address';
import {Status} from '@/types/common';

export default function AddressDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedAddress, detailsStatus, getAddressById } = useAddresses();
  const t = useTranslations();
  const entityName = t('address');

  const resolvedParams = React.use(params);
  const addressId = parseInt(resolvedParams.id);

  // Load address if not already loaded
  useEffect(() => {
    getAddressById(addressId);
  }, [getAddressById, addressId]);

  const config = useCreateAddressDetailsConfig(
    selectedAddress,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IAddress>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
