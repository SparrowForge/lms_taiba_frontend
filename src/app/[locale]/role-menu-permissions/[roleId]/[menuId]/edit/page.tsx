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


const RoleMenuPermissionEditPage: React.FC<{ params: Promise<{ roleId: string; menuId: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedRoleMenuPermission, detailsStatus, getRoleMenuPermissionById } = useRoleMenuPermissions();
  const t = useTranslations();
  const entityName = t('roleMenuPermission');

  useEffect(() => {
    const roleId = parseInt(resolvedParams.roleId);
    const menuId = parseInt(resolvedParams.menuId);
    getRoleMenuPermissionById(roleId, menuId);
  }, [resolvedParams.roleId, resolvedParams.menuId, getRoleMenuPermissionById]);


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

  if (!selectedRoleMenuPermission) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/role-menu-permissions')}>
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
            initialValues={selectedRoleMenuPermission}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleMenuPermissionEditPage;
