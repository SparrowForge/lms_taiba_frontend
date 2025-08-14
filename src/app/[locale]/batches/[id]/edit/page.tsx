'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BatchForm from '@/components/batches/BatchForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useBatches} from '@/hooks/useBatches';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const BatchEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedBatch, detailsStatus, getBatchById } = useBatches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });

  useEffect(() => {
    const batchId = parseInt(resolvedParams.id);
    getBatchById(batchId);
  }, [resolvedParams.id, getBatchById]);


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

  if (!selectedBatch || selectedBatch.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/batches')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}</Button>
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
          <BatchForm
            mode="edit"
            batchId={parseInt(resolvedParams.id)}
            initialValues={selectedBatch}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BatchEditPage;
