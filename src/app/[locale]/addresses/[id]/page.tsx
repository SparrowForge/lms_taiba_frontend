'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useCreateAddressDetailsConfig} from '@/components/addresses/addressConfig';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useAddresses} from '@/hooks/useAddresses';
import {useLocalization} from '@/hooks/useLocalization';

import {IAddress} from '@/types/address';
import {Status} from '@/types/common';

export default function AddressDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedAddress, detailsStatus, getAddressById } = useAddresses();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ADDRESS, { defaultValue: 'Address' });

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
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
