'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import BranchDetailsDrawer from '@/components/branches/BranchDetailsDrawer';
import BranchFormDrawer from '@/components/branches/BranchFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useBranches } from '@/hooks/useBranches';
import { useLocalization } from '@/hooks/useLocalization';

import { IBranch } from '@/types/branch';

export default function BranchesPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BRANCH, { defaultValue: 'Branch' });
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
    setDrawerVisible(false);
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
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
        title: t(LOCALE_KEYS.NAME),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.CODE),
        dataIndex: 'code',
        key: 'code',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.INSTITUTE),
        key: 'institute',
        render: (branch: IBranch) => <span>{branch.institute?.name}</span>,
      },
      {
        title: t(LOCALE_KEYS.ADDRESS),
        key: 'addressId',
        render: (branch: IBranch) => <span>{branch.address?.name}</span>,
      },
      {
        title: t(LOCALE_KEYS.EXTERNAL_INSTITUTE_ID_NO),
        dataIndex: 'externalInstituteIdNo',
        key: 'externalInstituteIdNo',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.CAMPUS_DIRECTOR_USER_ID),
        key: 'campusDirectorUserId',
        render: (branch: IBranch) => <span>{branch.campusDirector?.name}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t(LOCALE_KEYS.CREATED_AT),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (branch: IBranch) => (
          <EntityActions
            onView={() => router.push(`/branches/${branch.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/branches/${branch.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
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
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
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
