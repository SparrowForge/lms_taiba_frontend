'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFeeStructureDetailsConfig} from '@/components/feeStructures/feeStructureConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IFeeStructure} from '@/types/feeStructure';

export default function FeeStructureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedFeeStructure, detailsStatus, loadFeeStructure } = useFeeStructures();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' });

  const resolvedParams = React.use(params);
  const feeStructureId = parseInt(resolvedParams.id);

  // Load fee structure if not already loaded
  useEffect(() => {
    //getFeeStructureById(feeStructureId);
    loadFeeStructure(feeStructureId);
  }, [loadFeeStructure, feeStructureId]);

  const config = useCreateFeeStructureDetailsConfig(
    selectedFeeStructure,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IFeeStructure>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
