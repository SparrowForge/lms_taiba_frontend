'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateBranchDetailsConfig} from '@/components/branches/branchConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useBranches} from '@/hooks/useBranches';

import {IBranch} from '@/types/branch';
import {Status} from '@/types/common';

export default function BranchDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedBranch, detailsStatus, getBranchById } = useBranches();
  const t = useTranslations();
  const entityName = t('branch');

  const resolvedParams = React.use(params);
  const branchId = parseInt(resolvedParams.id);

  // Load branch if not already loaded
  useEffect(() => {
    getBranchById(branchId);
  }, [getBranchById, branchId]);

  const config = useCreateBranchDetailsConfig(
    selectedBranch,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
