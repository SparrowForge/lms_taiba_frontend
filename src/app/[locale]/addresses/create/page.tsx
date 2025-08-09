'use client';

import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React from 'react';

import AddressForm from '@/components/addresses/AddressForm';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';


export default function CreateAddressPage() {
  const t = useTranslations();
  const router = useRouter();
  const entityName = t('address', { defaultValue: 'Address' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('create_name', { name: entityName })} onBack={() => router.back()} />
          <AddressForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
