'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleMenuPermissionForm from '@/components/roleMenuPermissions/RoleMenuPermissionForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';

import {IRoleMenuPermission} from '@/types/roleMenuPermission';

interface RoleMenuPermissionEditPageProps {
  params: Promise<{ roleId: string; menuId: string; locale: string }>;
}

const RoleMenuPermissionEditPage: React.FC<RoleMenuPermissionEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const {
    roleMenuPermissions,
    listStatus,
    loadRoleMenuPermissions,
    getRoleMenuPermissionById,
    loadRoleMenuPermission,
  } = useRoleMenuPermissions();
  const [permission, setPermission] = useState<IRoleMenuPermission | null>(null);
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });

  useEffect(() => {
    const roleId = parseInt(resolvedParams.roleId);
    const menuId = parseInt(resolvedParams.menuId);
    const foundPermission = getRoleMenuPermissionById(roleId, menuId);
    if (foundPermission) {
      setPermission(foundPermission);
    } else {
      loadRoleMenuPermission(roleId, menuId);
    }
  }, [
    resolvedParams.roleId,
    resolvedParams.menuId,
    getRoleMenuPermissionById,
    loadRoleMenuPermission,
  ]);

  useEffect(() => {
    if (roleMenuPermissions.length === 0) {
      loadRoleMenuPermissions();
    }
  }, [roleMenuPermissions.length, loadRoleMenuPermissions]);

  useEffect(() => {
    if (roleMenuPermissions.length > 0) {
      const roleId = parseInt(resolvedParams.roleId);
      const menuId = parseInt(resolvedParams.menuId);
      const foundPermission = getRoleMenuPermissionById(roleId, menuId);
      if (foundPermission) {
        setPermission(foundPermission);
      }
    }
  }, [
    roleMenuPermissions,
    resolvedParams.roleId,
    resolvedParams.menuId,
    getRoleMenuPermissionById,
  ]);

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

  if (!permission) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/role-menu-permissions')}>
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
    view: permission.view,
    insert: permission.insert,
    update: permission.update,
    delete: permission.delete,
  });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <RoleMenuPermissionForm
            mode="edit"
            roleId={permission.roleId}
            menuId={permission.menuId}
            initialValues={getInitialValues()}
            embedded={false}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleMenuPermissionEditPage;
