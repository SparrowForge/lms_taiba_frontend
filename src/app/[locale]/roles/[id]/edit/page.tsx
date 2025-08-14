'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoleForm from '@/components/roles/RoleForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';


const RoleEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedRole, detailsStatus, getRoleById } = useRoles();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE, { defaultValue: 'Role' });

  useEffect(() => {
    const roleId = parseInt(resolvedParams.id);
    getRoleById(roleId);
  }, [resolvedParams.id, getRoleById]);


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

  if (!selectedRole || selectedRole.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
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
          <RoleForm
            mode="edit"
            roleId={parseInt(resolvedParams.id)}
            initialValues={selectedRole}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleEditPage;
