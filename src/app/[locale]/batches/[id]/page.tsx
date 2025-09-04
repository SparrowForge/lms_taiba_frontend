'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateBatchDetailsConfig} from '@/components/batches/batchConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useBatches} from '@/hooks/useBatches';
import {useLocalization} from '@/hooks/useLocalization';

import {IBatch} from '@/types/batch';
import {Status} from '@/types/common';

export default function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedBatch, detailsStatus, loadBatch } = useBatches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });

  const resolvedParams = React.use(params);
  const batchId = parseInt(resolvedParams.id);

  // Load batch if not already loaded
  useEffect(() => {
    //getBatchById(batchId);
    loadBatch(batchId);
  }, [loadBatch, batchId]);

  const config = useCreateBatchDetailsConfig(
    selectedBatch,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
