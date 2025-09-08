'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BatchEditForm from '@/components/batches/BatchEditForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useBatches} from '@/hooks/useBatches';
import {useLocalization} from '@/hooks/useLocalization';

const BatchEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedBatch, detailsStatus, loadBatch } = useBatches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });

  useEffect(() => {
    const batchId = parseInt(resolvedParams.id);
    //getBatchById(batchId);
    loadBatch(batchId);
  }, [resolvedParams.id, loadBatch]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedBatch || selectedBatch.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/batches" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <BatchEditForm batchId={parseInt(resolvedParams.id)} initialValues={selectedBatch} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BatchEditPage;
