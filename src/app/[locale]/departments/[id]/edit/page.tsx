'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import DepartmentForm from '@/components/departments/DepartmentForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useDepartments} from '@/hooks/useDepartments';

import {Status} from '@/types/common';


const DepartmentEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedDepartment, detailsStatus, getDepartmentById } = useDepartments();
  const t = useTranslations();
  const entityName = t('department');

  useEffect(() => {
    const departmentId = parseInt(resolvedParams.id);
    getDepartmentById(departmentId);
  }, [resolvedParams.id, getDepartmentById]);


  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t('loading', { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedDepartment || selectedDepartment.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/departments')}>
                  {t('backToList_name', { name: entityName })}</Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={() => router.back()} />
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
