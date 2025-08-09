'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import EmploymentTypeForm from '@/components/employmentTypes/EmploymentTypeForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';

import {IEmploymentType} from '@/types/employmentType';


interface PageProps {
  params: Promise<{ id: string }>;
}

const EmploymentTypeEditPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const {
    employmentTypes,
    listStatus,
    loadEmploymentTypes,
    getEmploymentTypeById,
    loadEmploymentType,
  } = useEmploymentTypes();
  const [item, setItem] = useState<IEmploymentType | null>(null);
  const t = useTranslations();
  const entityName = t('employmentType');

  useEffect(() => {
    const itemId = parseInt(resolvedParams.id);
    const found = getEmploymentTypeById(itemId);
    if (found) setItem(found);
    else loadEmploymentType(itemId);
  }, [resolvedParams.id, getEmploymentTypeById, loadEmploymentType]);

  useEffect(() => {
    if (employmentTypes.length === 0) loadEmploymentTypes();
  }, [employmentTypes.length, loadEmploymentTypes]);

  useEffect(() => {
    if (employmentTypes.length > 0) {
      const found = getEmploymentTypeById(parseInt(resolvedParams.id));
      if (found) setItem(found);
    }
  }, [employmentTypes, resolvedParams.id, getEmploymentTypeById]);

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            {t('loading', { defaultValue: 'Loading...' })}
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!item) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/employment-types')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => router.back();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <EmploymentTypeForm
            mode="edit"
            employmentTypeId={parseInt(resolvedParams.id)}
            initialValues={{ name: item.name, status: item.status }}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default EmploymentTypeEditPage;
