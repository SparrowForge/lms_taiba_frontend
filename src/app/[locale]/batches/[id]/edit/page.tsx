'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBatches } from '@/hooks/useBatches';
import { IBatch } from '@/types/batch';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageHeader } from '@/components/ui/PageHeader';
import BatchForm from '@/components/batches/BatchForm';
import { Card, Button } from 'antd';
import { useTranslations } from 'next-intl';

interface BatchEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BatchEditPage: React.FC<BatchEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { batches, listStatus, loadBatches, getBatchById, loadBatch } = useBatches();
  const [batch, setBatch] = useState<IBatch | null>(null);
  const t = useTranslations();
  const entityName = t('batch');

  useEffect(() => {
    const batchId = parseInt(resolvedParams.id);
    const foundBatch = getBatchById(batchId);
    if (foundBatch) {
      setBatch(foundBatch);
    } else {
      loadBatch(batchId);
    }
  }, [resolvedParams.id, getBatchById, loadBatch]);

  useEffect(() => {
    if (batches.length === 0) {
      loadBatches();
    }
  }, [batches.length, loadBatches]);

  useEffect(() => {
    if (batches.length > 0) {
      const foundBatch = getBatchById(parseInt(resolvedParams.id));
      if (foundBatch) {
        setBatch(foundBatch);
      }
    }
  }, [batches, resolvedParams.id, getBatchById]);

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div>{t('loading', { defaultValue: 'Loading...' })}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!batch) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/batches')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
      <div style={{ padding: '24px' }}>
        <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
        <BatchForm
            mode="edit"
            batchId={parseInt(resolvedParams.id)}
            initialValues={{
              name: batch.name,
              year: batch.year,
              session: batch.session,
              intakeCapacity: batch.intakeCapacity,
              courseId: batch.courseId,
            }}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BatchEditPage; 