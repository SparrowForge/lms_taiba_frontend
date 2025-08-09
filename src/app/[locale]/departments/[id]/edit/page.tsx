'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import DepartmentForm from '@/components/departments/DepartmentForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useDepartments} from '@/hooks/useDepartments';

import {IDepartment} from '@/types/department';

interface DepartmentEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const DepartmentEditPage: React.FC<DepartmentEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
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

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div>{t('loading', { defaultValue: 'Loading...' })}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!department) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/departments')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const getInitialValues = () => ({
    branchId: department.branchId,
    name: department.name,
    code: department.code,
    headId: department.headId,
    email: department.email,
    phone: department.phone,
    status: department.status,
  });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <DepartmentForm
            mode="edit"
            departmentId={department.id}
            initialValues={getInitialValues()}
            embedded={false}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DepartmentEditPage;
