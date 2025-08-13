'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleMenuPermissionForm from '@/components/roleMenuPermissions/RoleMenuPermissionForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermissionUpdate} from '@/types/roleMenuPermission';


const RoleMenuPermissionEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedRoleMenuPermission, detailsStatus, getRoleMenuPermissionById } = useRoleMenuPermissions();
  const t = useTranslations();
  const entityName = t('roleMenuPermission');

  const id = parseInt(resolvedParams.id);

  useEffect(() => {
    getRoleMenuPermissionById(id);
  }, [getRoleMenuPermissionById, id]);

  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Spin size="large" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedRoleMenuPermission || selectedRoleMenuPermission.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/roles')}>
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
          <RoleMenuPermissionForm
            mode="edit"
            roleMenuPermissionId={selectedRoleMenuPermission.id}
            initialValues={selectedRoleMenuPermission as IRoleMenuPermissionUpdate}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleMenuPermissionEditPage;
