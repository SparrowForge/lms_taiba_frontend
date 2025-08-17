'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FeeStructureForm from '@/components/feeStructures/FeeStructureForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const FeeStructureEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedFeeStructure, detailsStatus, getFeeStructureById } = useFeeStructures();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' });

  useEffect(() => {
    const feeStructureId = parseInt(resolvedParams.id);
    getFeeStructureById(feeStructureId);
  }, [resolvedParams.id, getFeeStructureById]);


  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedFeeStructure || selectedFeeStructure.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/fee-structures" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <FeeStructureForm
            mode="edit"
            feeStructureId={parseInt(resolvedParams.id)}
            initialValues={selectedFeeStructure}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default FeeStructureEditPage;
