'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import AddressForm from '@/components/addresses/AddressForm';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useAddresses} from '@/hooks/useAddresses';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const AddressEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedAddress, detailsStatus, getAddressById } = useAddresses();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ADDRESS, { defaultValue: 'Address' });

  const addressId = parseInt(resolvedParams.id);

  useEffect(() => {
    getAddressById(addressId);
  }, [addressId, getAddressById]);


  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedAddress || selectedAddress.id !== addressId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/addresses" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <AddressForm
            mode="edit"
            addressId={addressId}
            initialValues={selectedAddress}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AddressEditPage;
