'use client';

import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import {IDepartment} from '@/types/department';
import {useDepartments} from '@/hooks/useDepartments';
import {useEffect, useState} from 'react';
import {Status} from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRouter, useSearchParams} from 'next/navigation';
import DepartmentFormDrawer from '@/components/departments/DepartmentFormDrawer';
import DepartmentDetailsDrawer from '@/components/departments/DepartmentDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {useTranslations} from 'next-intl';
import {IBranch} from '@/types/branch';

export default function DepartmentsPage() {
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsDepartmentId, setSelectedDetailsDepartmentId] = useState<number | undefined>();

  const { departments, listStatus, pagination, loadDepartments } = useDepartments();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    const page = skip ? parseInt(skip) / parseInt(limit ?? '10') + 1 : 1;
    loadDepartments({ page, limit: parseInt(limit ?? '10') });
  }, [skip, limit, loadDepartments]);

  useEffect(() => {
    loadDepartments({ page: 1, limit: 10 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditDrawer = (departmentId: number) => {
    setSelectedDepartmentId(departmentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedDepartmentId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadDepartments({ page: 1, limit: 10 });
  };

  const handleViewDetails = (departmentId: number) => {
    setSelectedDetailsDepartmentId(departmentId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (departmentId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedDepartmentId(departmentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IDepartment> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/departments',
    searchFields: ['name', 'code', 'branch.name'] as (keyof IDepartment)[],
    onSearch: (searchText: string) => {
      loadDepartments({ page: 1, limit: 10, search: searchText });
    },
    onAdd: handleCreateDrawer,
    items: departments,
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
        title: t('branch'),
        dataIndex: 'branch',
        key: 'branch',
        render: (branch: IBranch) => <span>{branch?.name || 'N/A'}</span>,
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
        render: (department: IDepartment) => (
          <EntityActions
            onView={() => router.push(`/departments/${department.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/departments/${department.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => {}}
            id={department.id}
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
          onRetry={() => loadDepartments({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IDepartment>} />
        </AsyncErrorBoundary>

        <DepartmentFormDrawer
          mode={drawerMode}
          departmentId={selectedDepartmentId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <DepartmentDetailsDrawer
          departmentId={selectedDetailsDepartmentId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
