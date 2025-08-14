'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import AddressForm from '@/components/addresses/AddressForm';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
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
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedAddress || selectedAddress.id !== addressId) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/addresses')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
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
