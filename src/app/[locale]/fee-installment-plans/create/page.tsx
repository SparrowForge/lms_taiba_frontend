'use client';

import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import FeeInstallmentPlanForm from '@/components/feeInstallmentPlans/FeeInstallmentPlanForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';

export default function CreateFeeInstallmentPlanPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })} />
        <FeeInstallmentPlanForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
