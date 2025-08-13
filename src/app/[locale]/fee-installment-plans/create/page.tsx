'use client';

import {useTranslations} from 'next-intl';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FeeInstallmentPlanForm from '@/components/feeInstallmentPlans/FeeInstallmentPlanForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

export default function CreateFeeInstallmentPlanPage() {
  const t = useTranslations();
  const entityName = t('feeInstallmentPlan', { defaultValue: 'Fee Installment Plan' });

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t('create_name', { name: entityName })} />
        <FeeInstallmentPlanForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
}
