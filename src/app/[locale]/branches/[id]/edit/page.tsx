'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BranchForm from '@/components/branches/BranchForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useBranches} from '@/hooks/useBranches';

import {Status} from '@/types/common';


const BranchEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedBranch, detailsStatus, getBranchById } = useBranches();
  const t = useTranslations();
  const entityName = t('branch');

  useEffect(() => {
    const branchId = parseInt(resolvedParams.id);
    getBranchById(branchId);
  }, [resolvedParams.id, getBranchById]);


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

  if (!selectedBranch || selectedBranch.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/branches')}>
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
          <BranchForm
            mode="edit"
            branchId={parseInt(resolvedParams.id)}
            initialValues={selectedBranch}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BranchEditPage;
