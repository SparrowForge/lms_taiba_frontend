'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import AddressForm from '@/components/addresses/AddressForm';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';


export default function CreateAddressPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const entityName = t(LOCALE_KEYS.ADDRESS, { defaultValue: 'Address' });

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })} onBack={() => router.back()} />
          <AddressForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
