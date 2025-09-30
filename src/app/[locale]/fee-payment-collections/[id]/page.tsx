'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateFeePaymentCollectionDetailsConfig } from '@/components/feePaymentCollections/feePaymentCollectionConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections';
import { useLocalization } from '@/hooks/useLocalization';

import { IFeePaymentCollection } from '@/types/feePaymentCollection';

export default function FeePaymentCollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { selectedFeePaymentCollection, detailsStatus, loadFeePaymentCollection } =
    useFeePaymentCollections();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
    defaultValue: 'Fee Payment Collection',
  });

  const resolvedParams = React.use(params);
  const feePaymentCollectionId = parseInt(resolvedParams.id);

  // Load fee payment collection if not already loaded
  useEffect(() => {
    //getFeePaymentCollectionById(feePaymentCollectionId);
    loadFeePaymentCollection(feePaymentCollectionId);
  }, [loadFeePaymentCollection, feePaymentCollectionId]);

  const config = useCreateFeePaymentCollectionDetailsConfig(
    selectedFeePaymentCollection,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IFeePaymentCollection>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
