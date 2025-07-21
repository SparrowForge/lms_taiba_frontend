'use client';

import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import { IBranch } from '@/types/branch';
import { useBranches } from '@/hooks/useBranches';
import { useEffect, useState } from 'react';
import { Status } from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import BranchFormDrawer from '@/components/branches/BranchFormDrawer';
import BranchDetailsDrawer from '@/components/branches/BranchDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { useTranslations } from 'next-intl';

export default function BranchesPage() {
  const t = useTranslations();
  const entityName = t('branch', { defaultValue: 'Branch' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsBranchId, setSelectedDetailsBranchId] = useState<number | undefined>();

  const { branches, listStatus, pagination, loadBranches } = useBranches();

  useEffect(() => {
    loadBranches({ page: 1, limit: 10 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  console.log(branches);
  const config: EntityConfig<IBranch> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/branches',
    searchFields: ['name', 'code', 'location'] as (keyof IBranch)[],
    onSearch: (searchText: string) => {
      loadBranches({ page: 1, limit: 10, search: searchText });
    },
    onAdd: handleCreateDrawer,
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
        title: t('location'),
        dataIndex: 'location',
        key: 'location',
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
        width: 200,
        render: (branch: IBranch) => (
          <EntityActions
            onView={() => router.push(`/branches/${branch.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/branches/${branch.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => {}}
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
          error={listStatus.status === Status.FAILED ? new Error(listStatus.message || t('failed_name', { name: entityName })) : null}
          loading={listStatus.status === Status.LOADING}
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