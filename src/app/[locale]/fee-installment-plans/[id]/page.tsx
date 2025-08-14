'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFeeInstallmentPlanDetailsConfig} from '@/components/feeInstallmentPlans/feeInstallmentPlanConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IFeeInstallmentPlan} from '@/types/feeInstallmentPlan';

export default function FeeInstallmentPlanDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedFeeInstallmentPlan, detailsStatus, getFeeInstallmentPlanById } = useFeeInstallmentPlans();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' });

  const resolvedParams = React.use(params);
  const feeInstallmentPlanId = parseInt(resolvedParams.id);

  // Load fee installment plan if not already loaded
  useEffect(() => {
    getFeeInstallmentPlanById(feeInstallmentPlanId);
  }, [getFeeInstallmentPlanById, feeInstallmentPlanId]);

  const config = useCreateFeeInstallmentPlanDetailsConfig(
    selectedFeeInstallmentPlan,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IFeeInstallmentPlan>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
