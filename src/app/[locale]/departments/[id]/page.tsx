'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateDepartmentDetailsConfig} from '@/components/departments/departmentConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useDepartments} from '@/hooks/useDepartments';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IDepartment} from '@/types/department';

export default function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedDepartment, detailsStatus, loadDepartment } = useDepartments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DEPARTMENT, { defaultValue: 'Department' });

  const resolvedParams = React.use(params);
  const departmentId = parseInt(resolvedParams.id);

  // Load department if not already loaded
  useEffect(() => {
    //getDepartmentById(departmentId);
    loadDepartment(departmentId);
  }, [loadDepartment, departmentId]);

  const config = useCreateDepartmentDetailsConfig(
    selectedDepartment,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IDepartment>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
