'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateBranchDetailsConfig } from '@/components/branches/branchConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useBranches } from '@/hooks/useBranches';
import { useLocalization } from '@/hooks/useLocalization';

import { IBranch } from '@/types/branch';

export default function BranchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedBranch, detailsStatus, loadBranch } = useBranches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BRANCH, { defaultValue: 'Branch' });

  const resolvedParams = React.use(params);
  const branchId = parseInt(resolvedParams.id);

  // Load branch if not already loaded
  useEffect(() => {
    //getBranchById(branchId);
    loadBranch(branchId);
  }, [loadBranch, branchId]);

  const config = useCreateBranchDetailsConfig(
    selectedBranch,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IBranch>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
