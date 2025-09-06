'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateEmploymentTypeDetailsConfig} from '@/components/employmentTypes/employmentTypeConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IEmploymentType} from '@/types/employmentType';

export default function EmploymentTypeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedEmploymentType, detailsStatus, loadEmploymentType } = useEmploymentTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EMPLOYMENT_TYPE, { defaultValue: 'Employment Type' });

  const resolvedParams = React.use(params);
  const employmentTypeId = parseInt(resolvedParams.id);

  // Load employment type if not already loaded
  useEffect(() => {
    //getEmploymentTypeById(employmentTypeId);
    loadEmploymentType(employmentTypeId);
  }, [loadEmploymentType, employmentTypeId]);

  const config = useCreateEmploymentTypeDetailsConfig(
    selectedEmploymentType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
