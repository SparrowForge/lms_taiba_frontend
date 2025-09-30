'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateFeePaymentDetailsDetailsConfig } from '@/components/feePaymentDetails/feePaymentDetailsConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useFeePaymentDetails } from '@/hooks/useFeePaymentDetails';
import { useLocalization } from '@/hooks/useLocalization';

import { IFeePaymentDetails } from '@/types/feePaymentDetails';

export default function FeePaymentDetailsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { selectedFeePaymentDetail, detailsStatus, loadFeePaymentDetail } = useFeePaymentDetails();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' });

  const resolvedParams = React.use(params);
  const feePaymentDetailId = parseInt(resolvedParams.id);

  // Load fee payment detail if not already loaded
  useEffect(() => {
    //getFeePaymentDetailById(feePaymentDetailId);
    loadFeePaymentDetail(feePaymentDetailId);
  }, [loadFeePaymentDetail, feePaymentDetailId]);

  const config = useCreateFeePaymentDetailsDetailsConfig(
    selectedFeePaymentDetail,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IFeePaymentDetails>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
