'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCreateMarkDistributionDetailsConfig } from '@/components/markDistributions/markDistributionConfig';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { useMarkDistributions } from '@/hooks/useMarkDistributions';

import { IMarkDistribution } from '@/types/markDistribution';

export default function MarkDistributionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MARK_DISTRIBUTION, { defaultValue: 'Mark Distribution' });
  const { selectedMarkDistribution, loadMarkDistribution, detailsStatus } = useMarkDistributions();

  const resolvedParams = React.use(params);
  const markDistributionId = parseInt(resolvedParams.id);

  useEffect(() => {
    loadMarkDistribution(markDistributionId);
  }, [markDistributionId, loadMarkDistribution]);

  const config = useCreateMarkDistributionDetailsConfig(
    selectedMarkDistribution,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IMarkDistribution>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
