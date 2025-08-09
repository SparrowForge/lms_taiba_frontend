'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleForm from '@/components/roles/RoleForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useRoles} from '@/hooks/useRoles';

import {IRole} from '@/types/role';

interface RoleEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const RoleEditPage: React.FC<RoleEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { roles, listStatus, loadRoles, getRoleById, loadRole } = useRoles();
  const [role, setRole] = useState<IRole | null>(null);
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });

  useEffect(() => {
    const roleId = parseInt(resolvedParams.id);
    const foundRole = getRoleById(roleId);
    if (foundRole) {
      setRole(foundRole);
    } else {
      loadRole(roleId);
    }
  }, [resolvedParams.id, getRoleById, loadRole]);

  useEffect(() => {
    if (roles.length === 0) {
      loadRoles();
    }
  }, [roles.length, loadRoles]);

  useEffect(() => {
    if (roles.length > 0) {
      const foundRole = getRoleById(parseInt(resolvedParams.id));
      if (foundRole) {
        setRole(foundRole);
      }
    }
  }, [roles, resolvedParams.id, getRoleById]);

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

  if (!role) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/roles')}>
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
    branchId: role.branchId,
    name: role.name,
    description: role.description,
  });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <RoleForm
            mode="edit"
            roleId={role.id}
            initialValues={getInitialValues()}
            embedded={false}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleEditPage;
