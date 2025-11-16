'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import RoleDetailsDrawer from '@/components/roles/RoleDetailsDrawer';
import RoleFormDrawer from '@/components/roles/RoleFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useLocalization } from '@/hooks/useLocalization';
import { useRoles } from '@/hooks/useRoles';

import { IBranch } from '@/types/branch';
import { IRole } from '@/types/role';
import { useTranslations } from 'next-intl';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useBranches } from '@/hooks/useBranches';

export default function RolesPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.ROLE, { defaultValue: 'Role' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsRoleId, setSelectedDetailsRoleId] = useState<number | undefined>();

  const { roles, listStatus, pagination, loadRoles, removeRole } = useRoles();
  const {branches, loadBranches} = useBranches()

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  const loadWithParams = (
    searchParams: URLSearchParams,
    skip: string | null,
    limit: string | null,
  ) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    loadRoles({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadRoles]);

  useEffect(() => {
    loadBranches({page:1, limit:99});
  }, [loadBranches]);

  const handleEditDrawer = (roleId: number) => {
    setSelectedRoleId(roleId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedRoleId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadRoles({ page: 1, limit: 10 });
  };

  const handleViewDetails = (roleId: number) => {
    setSelectedDetailsRoleId(roleId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (roleId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedRoleId(roleId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IRole> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/roles',
    searchFields: ['name', 'description', 'status'] as (keyof IRole)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadRoles({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: roles,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
        filters: [
      {
        key: 'status',
        label: t(LOCALE_KEYS.STATUS),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...ENTITY_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
        ],
      },
       {
        key: 'branchId',
        label: t(LOCALE_KEYS.BRANCH),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...branches.map((c) => ({ label: c.name, value: String(c.id) })),
        ],
      },
    ],
    columns: [
      {
        title: t(LOCALE_KEYS.NAME),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.DESCRIPTION),
        dataIndex: 'description',
        key: 'description',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.BRANCH),
        dataIndex: 'branch',
        key: 'branch',
        render: (branch: IBranch) => <span>{branch?.name || 'N/A'}</span>,
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
        render: (role: IRole) => (
          <EntityActions
            onView={() => router.push(`/roles/${role.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/roles/${role.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeRole(role.id)}
            id={role.id}
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
          onRetry={() => loadRoles({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IRole>} />
        </AsyncErrorBoundary>

        <RoleFormDrawer
          mode={drawerMode}
          roleId={selectedRoleId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <RoleDetailsDrawer
          roleId={selectedDetailsRoleId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
