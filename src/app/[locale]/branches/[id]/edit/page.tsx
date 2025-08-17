'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BranchForm from '@/components/branches/BranchForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useBranches} from '@/hooks/useBranches';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const BranchEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedBranch, detailsStatus, getBranchById } = useBranches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BRANCH, { defaultValue: 'Branch' });

  useEffect(() => {
    const branchId = parseInt(resolvedParams.id);
    getBranchById(branchId);
  }, [resolvedParams.id, getBranchById]);


  if (detailsStatus.status === Status.LOADING) {
      return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedBranch || selectedBranch.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/branches" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <BranchForm
            mode="edit"
            branchId={parseInt(resolvedParams.id)}
            initialValues={selectedBranch}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BranchEditPage;
