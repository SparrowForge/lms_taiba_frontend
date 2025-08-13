'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateDepartmentDetailsConfig} from '@/components/departments/departmentConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useDepartments} from '@/hooks/useDepartments';

import {Status} from '@/types/common';
import {IDepartment} from '@/types/department';

export default function DepartmentDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedDepartment, detailsStatus, getDepartmentById } = useDepartments();
  const t = useTranslations();
  const entityName = t('department');

  const resolvedParams = React.use(params);
  const departmentId = parseInt(resolvedParams.id);

  // Load department if not already loaded
  useEffect(() => {
    getDepartmentById(departmentId);
  }, [getDepartmentById, departmentId]);

  const config = useCreateDepartmentDetailsConfig(
    selectedDepartment,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
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
