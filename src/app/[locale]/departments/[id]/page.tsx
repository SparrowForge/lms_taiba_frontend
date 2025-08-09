'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateDepartmentDetailsConfig} from '@/components/departments/departmentConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useDepartments} from '@/hooks/useDepartments';

import {Status} from '@/types/common';
import {IDepartment} from '@/types/department';

interface DepartmentDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const DepartmentDetailPage: React.FC<DepartmentDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { departments, listStatus, loadDepartments, getDepartmentById, loadDepartment } =
    useDepartments();
  const [department, setDepartment] = useState<IDepartment | null>(null);
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });

  useEffect(() => {
    const departmentId = parseInt(resolvedParams.id);
    const foundDepartment = getDepartmentById(departmentId);
    if (foundDepartment) {
      setDepartment(foundDepartment);
    } else {
      loadDepartment(departmentId);
    }
  }, [resolvedParams.id, getDepartmentById, loadDepartment]);

  useEffect(() => {
    if (departments.length === 0) {
      loadDepartments();
    }
  }, [departments.length, loadDepartments]);

  useEffect(() => {
    if (departments.length > 0) {
      const foundDepartment = getDepartmentById(parseInt(resolvedParams.id));
      if (foundDepartment) {
        setDepartment(foundDepartment);
      }
    }
  }, [departments, resolvedParams.id, getDepartmentById]);

  const config = useCreateDepartmentDetailsConfig(
    department,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IDepartment>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DepartmentDetailPage;
