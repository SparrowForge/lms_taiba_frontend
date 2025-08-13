'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FeeInstallmentPlanForm from '@/components/feeInstallmentPlans/FeeInstallmentPlanForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';

import {Status} from '@/types/common';
import {IFeeInstallmentPlanUpdate} from '@/types/feeInstallmentPlan';


const FeeInstallmentPlanEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFeeInstallmentPlan, detailsStatus, getFeeInstallmentPlanById } = useFeeInstallmentPlans();
  const t = useTranslations();
  const entityName = t('feeInstallmentPlan');

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
            <div>{t('loading', { defaultValue: 'Loading...' })} {entityName}</div>
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
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/addresses')}>
                  {t('backToList_name', { name: entityName })}
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
          <PageHeader title={t('edit_name', { name: entityName })} onBack={() => router.back()} />
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
