'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import DepartmentDetailsDrawer from '@/components/departments/DepartmentDetailsDrawer';
import DepartmentFormDrawer from '@/components/departments/DepartmentFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useDepartments} from '@/hooks/useDepartments';

import {IBranch} from '@/types/branch';
import {Status} from '@/types/common';
import {IDepartment} from '@/types/department';

export default function DepartmentsPage() {
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsDepartmentId, setSelectedDetailsDepartmentId] = useState<
    number | undefined
  >();

  const { departments, listStatus, pagination, loadDepartments, removeDepartment } =
    useDepartments();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadDepartments({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadDepartments({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadDepartments]);

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
    title: t('management_name', { name: entityName }),
    route: '/departments',
    searchFields: ['name', 'code', 'status'] as (keyof IDepartment)[],
    onSearch: (searchText: string) => {
      loadDepartments({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
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
        key: 'branch',
        render: (branch: IBranch) => <span>{branch?.name || 'N/A'}</span>,
      },
      {
        title: t('head'),
        key: 'head',
        render: (department: IDepartment) => <span>{department.head?.fullName || 'N/A'}</span>,
      },
      {
        title: t('email'),
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('phone'),
        dataIndex: 'phone',
        key: 'phone',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
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
            onDelete={() => removeDepartment(department.id)}
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
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
              : null
          }
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
