'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleMenuPermissionForm from '@/components/roleMenuPermissions/RoleMenuPermissionForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {Status} from '@/types/common';
import {IRoleMenuPermissionUpdate} from '@/types/roleMenuPermission';


const RoleMenuPermissionEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedRoleMenuPermission, detailsStatus, getRoleMenuPermissionById } = useRoleMenuPermissions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });

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
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/roles')}>
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
