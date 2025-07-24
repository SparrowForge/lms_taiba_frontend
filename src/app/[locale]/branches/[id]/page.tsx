'use client';

import React, { useEffect, useState } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { IBranch } from '@/types/branch';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateBranchDetailsConfig } from '@/components/branches/branchConfig';
import { Status } from '@/types/common';
import { useTranslations } from 'next-intl';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

interface BranchDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BranchDetailPage: React.FC<BranchDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { branches, listStatus, loadBranches, getBranchById, loadBranch } = useBranches();
  const [branch, setBranch] = useState<IBranch | null>(null);
  const t = useTranslations();
  const entityName = t('branch');

  useEffect(() => {
    const branchId = parseInt(resolvedParams.id);
    const foundBranch = getBranchById(branchId);
    if (foundBranch) {
      setBranch(foundBranch);
    } else {
      loadBranch(branchId);
    }
  }, [resolvedParams.id, getBranchById, loadBranch]);

  useEffect(() => {
    if (branches.length === 0) {
      loadBranches();
    }
  }, [branches.length, loadBranches]);

  useEffect(() => {
    if (branches.length > 0) {
      const foundBranch = getBranchById(parseInt(resolvedParams.id));
      if (foundBranch) {
        setBranch(foundBranch);
      }
    }
  }, [branches, resolvedParams.id, getBranchById]);

  const config = useCreateBranchDetailsConfig(
    branch,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || t('failed_name', { name: entityName }) : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IBranch>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BranchDetailPage; 