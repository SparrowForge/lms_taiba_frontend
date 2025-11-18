'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import FeePaymentCollectionForm from '@/components/feePaymentCollections/FeePaymentCollectionForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections';
import { useLocalization } from '@/hooks/useLocalization';

const FeePaymentCollectionEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFeePaymentCollection, detailsStatus, loadFeePaymentCollection } =
    useFeePaymentCollections();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
    defaultValue: 'Fee Payment Collection',
  });

  useEffect(() => {
    const feePaymentCollectionId = parseInt(resolvedParams.id);
    //getFeePaymentCollectionById(feePaymentCollectionId);
    loadFeePaymentCollection(feePaymentCollectionId);
  }, [resolvedParams.id, loadFeePaymentCollection]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (
    !selectedFeePaymentCollection ||
    selectedFeePaymentCollection.id !== parseInt(resolvedParams.id)
  ) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/fee-payment-collections" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <FeePaymentCollectionForm
          mode="edit"
          feePaymentCollectionId={parseInt(resolvedParams.id)}
          initialValues={selectedFeePaymentCollection}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FeePaymentCollectionEditPage;
