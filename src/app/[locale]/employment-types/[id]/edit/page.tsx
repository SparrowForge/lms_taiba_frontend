'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import EmploymentTypeForm from '@/components/employmentTypes/EmploymentTypeForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';

import {Status} from '@/types/common';


const EmploymentTypeEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedEmploymentType, detailsStatus, getEmploymentTypeById } = useEmploymentTypes();
  const t = useTranslations();
  const entityName = t('employmentType');

  useEffect(() => {
    const employmentTypeId = parseInt(resolvedParams.id);
    getEmploymentTypeById(employmentTypeId);
  }, [resolvedParams.id, getEmploymentTypeById]);


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

  if (!selectedEmploymentType || selectedEmploymentType.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/employment-types')}>
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
