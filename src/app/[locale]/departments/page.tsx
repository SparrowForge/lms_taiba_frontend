'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DepartmentDetailsDrawer from '@/components/departments/DepartmentDetailsDrawer';
import DepartmentFormDrawer from '@/components/departments/DepartmentFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useDepartments } from '@/hooks/useDepartments';
import { useLocalization } from '@/hooks/useLocalization';

import { IDepartment } from '@/types/department';
import { useBranches } from '@/hooks/useBranches';

export default function DepartmentsPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.DEPARTMENT, { defaultValue: 'Department' });
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
  const {branches,loadBranches} = useBranches()

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const branchId = searchParams.get('branchId');

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
      loadDepartments({ page, limit: limitNum, ...params });
    };
  
    useEffect(() => {
      loadWithParams(searchParams, skip, limit);
    }, [searchParams, skip, limit, loadDepartments]);

      // Load batch options for filter
    useEffect(() => {
        if (branchId) {
          loadBranches({ page: 1, limit: 99, branchId: parseInt(branchId) });
        } 
      }, [loadBranches, branchId]);


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
    setDrawerVisible(false);
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/departments',
    searchFields: ['name', 'code', 'status'] as (keyof IDepartment)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadDepartments({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: departments,
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
        title: t(LOCALE_KEYS.BRANCH),
        key: 'branch',
        render: (department: IDepartment) => <span>{department.branch?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.HEAD),
        key: 'head',
        render: (department: IDepartment) => <span>{department.head?.fullName || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.EMAIL),
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.PHONE),
        dataIndex: 'phone',
        key: 'phone',
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
        render: (department: IDepartment) => (
          <EntityActions
            onView={() => router.push(`/departments/${department.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/departments/${department.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeDepartment(department.id)}
            id={department.id}
          />
        ),
      },
    ],
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
            ...branches.map((b) => ({ label: b.name, value: String(b.id) })),
          ],
      },
      {
        key: 'name',
        label: t(LOCALE_KEYS.DEPARTMENT),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
            ...departments.map((d) => ({ label: d.name, value: String(d.name) })),
          ],
      },
      {
        key: 'code',
        label: t(LOCALE_KEYS.CODE),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
            ...departments.map((d) => ({ label: d.code, value: String(d.code) })),
          ],
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
