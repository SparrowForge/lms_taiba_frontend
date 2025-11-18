'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import FeePaymentDetailsForm from '@/components/feePaymentDetails/FeePaymentDetailsForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useFeePaymentDetails } from '@/hooks/useFeePaymentDetails';
import { useLocalization } from '@/hooks/useLocalization';

const FeePaymentDetailsEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFeePaymentDetail, detailsStatus, loadFeePaymentDetail } = useFeePaymentDetails();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' });

  useEffect(() => {
    const feePaymentDetailId = parseInt(resolvedParams.id);
    //getFeePaymentDetailById(feePaymentDetailId);
    loadFeePaymentDetail(feePaymentDetailId);
  }, [resolvedParams.id, loadFeePaymentDetail]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedFeePaymentDetail || selectedFeePaymentDetail.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/fee-payment-details" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <FeePaymentDetailsForm
          mode="edit"
          feePaymentDetailId={parseInt(resolvedParams.id)}
          initialValues={selectedFeePaymentDetail}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FeePaymentDetailsEditPage;
