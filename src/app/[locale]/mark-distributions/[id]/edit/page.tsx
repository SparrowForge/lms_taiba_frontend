'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS, t} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import MarkDistributionForm from '@/components/markDistributions/MarkDistributionForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useMarkDistributions} from '@/hooks/useMarkDistributions';

export default function EditMarkDistributionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { selectedMarkDistribution, loadMarkDistribution, detailsStatus } = useMarkDistributions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MARK_DISTRIBUTION, { defaultValue: 'Mark Distribution' });

  const resolvedParams = React.use(params);
  const markDistributionId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getMarkDistributionById(markDistributionId);
    loadMarkDistribution(markDistributionId);
  }, [markDistributionId, loadMarkDistribution]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedMarkDistribution || selectedMarkDistribution.id !== markDistributionId) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/mark-distributions" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <MarkDistributionForm
          mode="edit"
          markDistributionId={markDistributionId}
          initialValues={selectedMarkDistribution}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
