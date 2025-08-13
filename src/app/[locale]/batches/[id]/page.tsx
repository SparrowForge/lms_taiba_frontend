'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateBatchDetailsConfig} from '@/components/batches/batchConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useBatches} from '@/hooks/useBatches';

import {IBatch} from '@/types/batch';
import {Status} from '@/types/common';

export default function BatchDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedBatch, detailsStatus, getBatchById } = useBatches();
  const t = useTranslations();
  const entityName = t('batch');

  const resolvedParams = React.use(params);
  const batchId = parseInt(resolvedParams.id);

  // Load batch if not already loaded
  useEffect(() => {
    getBatchById(batchId);
  }, [getBatchById, batchId]);

  const config = useCreateBatchDetailsConfig(
    selectedBatch,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IBatch>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
