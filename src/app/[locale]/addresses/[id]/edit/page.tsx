'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import AddressForm from '@/components/addresses/AddressForm';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useAddresses} from '@/hooks/useAddresses';

import {IAddress} from '@/types/address';


interface AddressEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const AddressEditPage: React.FC<AddressEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
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

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div>{t('loading', { defaultValue: 'Loading...' })}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!address) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/addresses')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <AddressForm
            mode="edit"
            addressId={parseInt(resolvedParams.id)}
            initialValues={{
              name: address.name,
              address: address.address,
              city: address.city,
              state: address.state,
              zipCode: address.zipCode,
              country: address.country,
              phone: address.phone,
              email: address.email,
            }}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AddressEditPage;
