'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFeeInstallmentPlanDetailsConfig} from '@/components/feeInstallmentPlans/feeInstallmentPlanConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';

import {Status} from '@/types/common';
import {IFeeInstallmentPlan} from '@/types/feeInstallmentPlan';

export default function FeeInstallmentPlanDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedFeeInstallmentPlan, detailsStatus, getFeeInstallmentPlanById } = useFeeInstallmentPlans();
  const t = useTranslations();
  const entityName = t('feeInstallmentPlan');

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
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
