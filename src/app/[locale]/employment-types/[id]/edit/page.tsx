'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import EmploymentTypeForm from '@/components/employmentTypes/EmploymentTypeForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';
import {useLocalization} from '@/hooks/useLocalization';


const EmploymentTypeEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedEmploymentType, detailsStatus, loadEmploymentType } = useEmploymentTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EMPLOYMENT_TYPE, { defaultValue: 'Employment Type' });

  useEffect(() => {
    const employmentTypeId = parseInt(resolvedParams.id);
    //getEmploymentTypeById(employmentTypeId);
    loadEmploymentType(employmentTypeId);
  }, [resolvedParams.id, loadEmploymentType]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedEmploymentType || selectedEmploymentType.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/employment-types" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <EmploymentTypeForm
          mode="edit"
          employmentTypeId={parseInt(resolvedParams.id)}
          initialValues={selectedEmploymentType}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default EmploymentTypeEditPage;
