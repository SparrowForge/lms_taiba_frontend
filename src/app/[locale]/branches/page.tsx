'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import BranchDetailsDrawer from '@/components/branches/BranchDetailsDrawer';
import BranchFormDrawer from '@/components/branches/BranchFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useBranches} from '@/hooks/useBranches';

import {IBranch} from '@/types/branch';
import {Status} from '@/types/common';


export default function BranchesPage() {
  const t = useTranslations();
  const entityName = t('branch', { defaultValue: 'Branch' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsBranchId, setSelectedDetailsBranchId] = useState<number | undefined>();

  const { branches, listStatus, pagination, loadBranches, removeBranch } = useBranches();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadBranches({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadBranches({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadBranches]);

  const handleEditDrawer = (branchId: number) => {
    setSelectedBranchId(branchId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedBranchId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadBranches({ page: 1, limit: 10 });
  };

  const handleViewDetails = (branchId: number) => {
    setSelectedDetailsBranchId(branchId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (branchId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedBranchId(branchId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IBranch> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/branches',
    searchFields: ['name', 'code'] as (keyof IBranch)[],
    onSearch: (searchText: string) => {
      loadBranches({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: branches,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('name'),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('code'),
        dataIndex: 'code',
        key: 'code',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('instituteId'),
        dataIndex: 'instituteId',
        key: 'instituteId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('address'),
        dataIndex: 'addressId',
        key: 'addressId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('externalInstituteIdNo'),
        dataIndex: 'externalInstituteIdNo',
        key: 'externalInstituteIdNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('campusDirectorUserId'),
        dataIndex: 'campusDirectorUserId',
        key: 'campusDirectorUserId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('createdAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t('actions'),
        key: 'actions',
        width: 100,
        render: (branch: IBranch) => (
          <EntityActions
            onView={() => router.push(`/branches/${branch.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/branches/${branch.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeBranch(branch.id)}
            id={branch.id}
          />
        ),
      },
    ],
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <AsyncErrorBoundary
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
              : null
          }
          onRetry={() => loadBranches({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IBranch>} />
        </AsyncErrorBoundary>

        <BranchFormDrawer
          mode={drawerMode}
          branchId={selectedBranchId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <BranchDetailsDrawer
          branchId={selectedDetailsBranchId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
