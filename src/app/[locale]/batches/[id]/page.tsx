'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import BatchDetailView from '@/components/batches/BatchDetailView';
import { getBatchDisplayName } from '@/components/batches/batchConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useBatches } from '@/hooks/useBatches';
import { useLocalization } from '@/hooks/useLocalization';

export default function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedBatch, detailsStatus, loadBatch } = useBatches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });

  const resolvedParams = React.use(params);
  const batchId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadBatch(batchId);
  }, [loadBatch, batchId]);

  const title = selectedBatch
    ? getBatchDisplayName(selectedBatch)
    : t(LOCALE_KEYS.DETAILS_NAME, { name: entityName });
  const error =
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null;

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={title} onBack={() => router.back()} />
        <div style={{ margin: '8px', padding: '0 8px' }}>
          <BatchDetailView
            batch={selectedBatch}
            loading={detailsStatus.status === Status.LOADING}
            error={error}
            entityName={entityName}
            onBack={() => router.back()}
            t={t}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
