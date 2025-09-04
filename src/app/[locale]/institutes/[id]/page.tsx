'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateInstituteDetailsConfig} from '@/components/institutes/instituteConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useInstitutes} from '@/hooks/useInstitutes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IInstitute} from '@/types/institute';

export default function InstituteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedInstitute, detailsStatus, getInstituteById, loadInstitute } = useInstitutes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.INSTITUTE, { defaultValue: 'Institute' });

  const resolvedParams = React.use(params);
  const instituteId = parseInt(resolvedParams.id);

  // Load institute if not already loaded
  useEffect(() => {
    //getInstituteById(instituteId);
    loadInstitute(instituteId);
  }, [loadInstitute, instituteId]);

  const config = useCreateInstituteDetailsConfig(
    selectedInstitute,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
