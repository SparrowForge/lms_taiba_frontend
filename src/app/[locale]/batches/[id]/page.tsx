'use client';

import React, { useEffect, useState } from 'react';
import { useBatches } from '@/hooks/useBatches';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { IBatch } from '@/types/batch';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { createBatchDetailsConfig } from '@/components/batches/batchConfig';
import { Status } from '@/types/common';
import { useTranslations } from 'next-intl';

interface BatchDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BatchDetailPage: React.FC<BatchDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
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

  const config = createBatchDetailsConfig(
    batch,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || t('failed_name', { name: entityName }) : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BatchDetailPage; 