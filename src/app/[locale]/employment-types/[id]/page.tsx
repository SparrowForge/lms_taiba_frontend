'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateEmploymentTypeDetailsConfig} from '@/components/employmentTypes/employmentTypeConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';

import {Status} from '@/types/common';
import {IEmploymentType} from '@/types/employmentType';

export default function EmploymentTypeDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedEmploymentType, detailsStatus, getEmploymentTypeById } = useEmploymentTypes();
  const t = useTranslations();
  const entityName = t('employmentType');

  const resolvedParams = React.use(params);
  const employmentTypeId = parseInt(resolvedParams.id);

  // Load employment type if not already loaded
  useEffect(() => {
    getEmploymentTypeById(employmentTypeId);
  }, [getEmploymentTypeById, employmentTypeId]);

  const config = useCreateEmploymentTypeDetailsConfig(
    selectedEmploymentType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IEmploymentType>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
