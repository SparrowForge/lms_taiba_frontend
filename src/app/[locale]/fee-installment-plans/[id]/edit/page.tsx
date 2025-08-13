'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FeeInstallmentPlanForm from '@/components/feeInstallmentPlans/FeeInstallmentPlanForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IFeeInstallmentPlanUpdate} from '@/types/feeInstallmentPlan';


const FeeInstallmentPlanEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFeeInstallmentPlan, detailsStatus, getFeeInstallmentPlanById } = useFeeInstallmentPlans();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' });

  const id = parseInt(resolvedParams.id);

  useEffect(() => {
    getFeeInstallmentPlanById(id);
  }, [getFeeInstallmentPlanById, id]);

  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
        <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedFeeInstallmentPlan || selectedFeeInstallmentPlan.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
        <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/addresses')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
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
