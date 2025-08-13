'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import InstituteDetailsDrawer from '@/components/institutes/InstituteDetailsDrawer';
import InstituteFormDrawer from '@/components/institutes/InstituteFormDrawer';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useInstitutes} from '@/hooks/useInstitutes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IInstitute} from '@/types/institute';


export default function InstitutesPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.INSTITUTE, { defaultValue: 'Institute' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const { institutes, listStatus, pagination, loadInstitutes, removeInstitute } = useInstitutes();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadInstitutes({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadInstitutes({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadInstitutes]);

  const handleEditDrawer = (id: number) => {
    setSelectedId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };
  const handleCreateDrawer = () => {
    setSelectedId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };
  const handleDrawerSuccess = () => {
    loadInstitutes({ page: 1, limit: 10 });
  };
  const handleViewDetails = (id: number) => {
    setSelectedDetailsId(id);
    setDetailsDrawerVisible(true);
  };
  const handleDetailsEdit = (id: number) => {
    setDetailsDrawerVisible(false);
    setSelectedId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IInstitute> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/institutes',
    searchFields: ['name', 'status'] as (keyof IInstitute)[],
    onSearch: (searchText: string) => {
      loadInstitutes({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: institutes,
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
        render: (item: IInstitute) => (
          <EntityActions
            onView={() => router.push(`/institutes/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/institutes/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeInstitute(item.id)}
            id={item.id}
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
          onRetry={() => loadInstitutes({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IInstitute>} />
        </AsyncErrorBoundary>

        <InstituteFormDrawer
          mode={drawerMode}
          instituteId={selectedId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <InstituteDetailsDrawer
          instituteId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
