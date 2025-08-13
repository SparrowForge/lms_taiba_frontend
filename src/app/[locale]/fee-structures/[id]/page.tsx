'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFeeStructureDetailsConfig} from '@/components/feeStructures/feeStructureConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFeeStructures} from '@/hooks/useFeeStructures';

import {Status} from '@/types/common';
import {IFeeStructure} from '@/types/feeStructure';

export default function FeeStructureDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedFeeStructure, detailsStatus, getFeeStructureById } = useFeeStructures();
  const t = useTranslations();
  const entityName = t('feeStructure');

  const resolvedParams = React.use(params);
  const feeStructureId = parseInt(resolvedParams.id);

  // Load fee structure if not already loaded
  useEffect(() => {
    getFeeStructureById(feeStructureId);
  }, [getFeeStructureById, feeStructureId]);

  const config = useCreateFeeStructureDetailsConfig(
    selectedFeeStructure,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
