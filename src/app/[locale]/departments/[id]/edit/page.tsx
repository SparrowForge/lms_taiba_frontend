'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import DepartmentForm from '@/components/departments/DepartmentForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useDepartments} from '@/hooks/useDepartments';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const DepartmentEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedDepartment, detailsStatus, loadDepartment } = useDepartments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DEPARTMENT, { defaultValue: 'Department' });

  useEffect(() => {
    const departmentId = parseInt(resolvedParams.id);
    //getDepartmentById(departmentId);
    loadDepartment(departmentId);
  }, [resolvedParams.id, loadDepartment]);


  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedDepartment || selectedDepartment.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/departments" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <DepartmentForm
            mode="edit"
            departmentId={parseInt(resolvedParams.id)}
            initialValues={selectedDepartment}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DepartmentEditPage;
