'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateInstituteDetailsConfig} from '@/components/institutes/instituteConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useInstitutes} from '@/hooks/useInstitutes';

import {Status} from '@/types/common';
import {IInstitute} from '@/types/institute';

export default function InstituteDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedInstitute, detailsStatus, getInstituteById } = useInstitutes();
  const t = useTranslations();
  const entityName = t('institute');

  const resolvedParams = React.use(params);
  const instituteId = parseInt(resolvedParams.id);

  // Load institute if not already loaded
  useEffect(() => {
    getInstituteById(instituteId);
  }, [getInstituteById, instituteId]);

  const config = useCreateInstituteDetailsConfig(
    selectedInstitute,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IInstitute>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
