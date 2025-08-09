'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BranchForm from '@/components/branches/BranchForm';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';

import {useBranches} from '@/hooks/useBranches';

import {IBranch} from '@/types/branch';


interface BranchEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BranchEditPage: React.FC<BranchEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { branches, listStatus, loadBranches, getBranchById, loadBranch } = useBranches();
  const [branch, setBranch] = useState<IBranch | null>(null);
  const t = useTranslations();
  const entityName = t('branch');

  useEffect(() => {
    const branchId = parseInt(resolvedParams.id);
    const foundBranch = getBranchById(branchId);
    if (foundBranch) {
      setBranch(foundBranch);
    } else {
      loadBranch(branchId);
    }
  }, [resolvedParams.id, getBranchById, loadBranch]);

  useEffect(() => {
    if (branches.length === 0) {
      loadBranches();
    }
  }, [branches.length, loadBranches]);

  useEffect(() => {
    if (branches.length > 0) {
      const foundBranch = getBranchById(parseInt(resolvedParams.id));
      if (foundBranch) {
        setBranch(foundBranch);
      }
    }
  }, [branches, resolvedParams.id, getBranchById]);

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

  if (!branch) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/branches')}>
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

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <BranchForm
            mode="edit"
            branchId={parseInt(resolvedParams.id)}
            initialValues={{
              name: branch.name,
              instituteId: branch.instituteId,
              addressId: branch.addressId,
              externalInstituteIdNo: branch.externalInstituteIdNo,
              campusDirectorUserId: branch.campusDirectorUserId,
              status: branch.status,
              code: branch.code,
          }}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BranchEditPage;
