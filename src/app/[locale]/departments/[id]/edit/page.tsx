'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import DepartmentForm from '@/components/departments/DepartmentForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useDepartments} from '@/hooks/useDepartments';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';


const DepartmentEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedDepartment, detailsStatus, getDepartmentById } = useDepartments();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DEPARTMENT, { defaultValue: 'Department' });

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
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
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
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/departments')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}</Button>
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
