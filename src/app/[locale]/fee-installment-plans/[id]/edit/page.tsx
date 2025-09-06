'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FeeInstallmentPlanForm from '@/components/feeInstallmentPlans/FeeInstallmentPlanForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IFeeInstallmentPlanUpdate} from '@/types/feeInstallmentPlan';

const FeeInstallmentPlanEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFeeInstallmentPlan, detailsStatus, loadFeeInstallmentPlan } =
    useFeeInstallmentPlans();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' });

  const id = parseInt(resolvedParams.id);

  useEffect(() => {
    //getFeeInstallmentPlanById(id);
    loadFeeInstallmentPlan(id);
  }, [loadFeeInstallmentPlan, id]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (
    !selectedFeeInstallmentPlan ||
    selectedFeeInstallmentPlan.id !== parseInt(resolvedParams.id)
  ) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/fee-installment-plans" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <FeeInstallmentPlanForm
          mode="edit"
          feeInstallmentPlanId={selectedFeeInstallmentPlan.id}
          initialValues={selectedFeeInstallmentPlan as IFeeInstallmentPlanUpdate}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FeeInstallmentPlanEditPage;
