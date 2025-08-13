'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FeeStructureForm from '@/components/feeStructures/FeeStructureForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFeeStructures} from '@/hooks/useFeeStructures';

import {Status} from '@/types/common';


const FeeStructureEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFeeStructure, detailsStatus, getFeeStructureById } = useFeeStructures();
  const t = useTranslations();
  const entityName = t('feeStructure');

  useEffect(() => {
    const feeStructureId = parseInt(resolvedParams.id);
    getFeeStructureById(feeStructureId);
  }, [resolvedParams.id, getFeeStructureById]);


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

  if (!selectedFeeStructure || selectedFeeStructure.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/fee-structures')}>
                  {t('backToList_name', { name: entityName })}</Button>
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
          <FeeStructureForm
            mode="edit"
            feeStructureId={parseInt(resolvedParams.id)}
            initialValues={selectedFeeStructure}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FeeStructureEditPage;
