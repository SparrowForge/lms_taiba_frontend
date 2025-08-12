'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateBranchDetailsConfig} from '@/components/branches/branchConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import { useAudit } from '@/hooks/useAudit';
import {useBranches} from '@/hooks/useBranches';

import {IBranch} from '@/types/branch';
import {Status} from '@/types/common';


interface BranchDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BranchDetailPage: React.FC<BranchDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { branches, listStatus, loadBranches, getBranchById, loadBranch } = useBranches();
  const { loadAuditsByResource} = useAudit();
  const [branch, setBranch] = useState<IBranch | null>(null);
  const t = useTranslations();
  const entityName = t('branch');

  useEffect(() => {
    loadAuditsByResource('branches', parseInt(resolvedParams.id));
  }, []);


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
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
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
