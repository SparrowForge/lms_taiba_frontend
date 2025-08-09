'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import SemesterDetailsDrawer from '@/components/semesters/SemesterDetailsDrawer';
import SemesterFormDrawer from '@/components/semesters/SemesterFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useSemesters} from '@/hooks/useSemesters';

import {IBatch} from '@/types/batch';
import {Status} from '@/types/common';
import {ISemester} from '@/types/semester';

export default function SemestersPage() {
  const t = useTranslations();
  const entityName = t('semester', { defaultValue: 'Semester' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsSemesterId, setSelectedDetailsSemesterId] = useState<number | undefined>();

  const { semesters, listStatus, pagination, loadSemesters, removeSemester } = useSemesters();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadSemesters({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadSemesters({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadSemesters]);

  const handleEditDrawer = (semesterId: number) => {
    setSelectedSemesterId(semesterId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedSemesterId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadSemesters({ page: 1, limit: 10 });
  };

  const handleViewDetails = (semesterId: number) => {
    setSelectedDetailsSemesterId(semesterId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (semesterId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedSemesterId(semesterId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<ISemester> = {
    name: entityName,
    title: t('management_name', { name: entityName }),
    route: '/semesters',
    searchFields: ['name', 'termNo', 'status'] as (keyof ISemester)[],
    onSearch: (searchText: string) => {
      loadSemesters({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: semesters,
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
        title: t('termNo'),
        dataIndex: 'termNo',
        key: 'termNo',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('startDate'),
        dataIndex: 'startDate',
        key: 'startDate',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('endDate'),
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t('batch'),
        dataIndex: 'batch',
        key: 'batch',
        render: (batch: IBatch) => <span>{batch?.name || 'N/A'}</span>,
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
        render: (semester: ISemester) => (
          <EntityActions
            onView={() => router.push(`/semesters/${semester.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/semesters/${semester.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeSemester(semester.id)}
            id={semester.id}
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
          onRetry={() => loadSemesters({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<ISemester>} />
        </AsyncErrorBoundary>

        <SemesterFormDrawer
          mode={drawerMode}
          semesterId={selectedSemesterId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <SemesterDetailsDrawer
          semesterId={selectedDetailsSemesterId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
