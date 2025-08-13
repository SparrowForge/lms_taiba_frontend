'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import FacultyDetailsDrawer from '@/components/faculties/FacultyDetailsDrawer';
import FacultyFormDrawer from '@/components/faculties/FacultyFormDrawer';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';

import {IBranch} from '@/types/branch';
import {Status} from '@/types/common';
import {IDepartment} from '@/types/department';
import {IFaculty} from '@/types/faculty';

export default function FacultyPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY, { defaultValue: 'Faculty' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsFacultyId, setSelectedDetailsFacultyId] = useState<number | undefined>();

  const { faculties, listStatus, pagination, loadFaculties, removeFaculty } = useFaculties();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadFaculties({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadFaculties({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadFaculties]);

  const handleEditDrawer = (facultyId: number) => {
    setSelectedFacultyId(facultyId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedFacultyId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadFaculties({ page: 1, limit: 10 });
  };

  const handleViewDetails = (facultyId: number) => {
    setSelectedDetailsFacultyId(facultyId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (facultyId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedFacultyId(facultyId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IFaculty> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/faculties',
    searchFields: ['fullName', 'email', 'employeeCode'] as (keyof IFaculty)[],
    onSearch: (searchText: string) => {
      loadFaculties({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: faculties,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.FULL_NAME),
        dataIndex: 'fullName',
        key: 'fullName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.EMAIL),
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.EMPLOYEE_CODE),
        dataIndex: 'employeeCode',
        key: 'employeeCode',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.EMPLOYMENT_TYPE),
        dataIndex: 'employmentType',
        key: 'employmentType',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t(LOCALE_KEYS.BRANCH),
        dataIndex: 'branch',
        key: 'branch',
        render: (branch: IBranch) => <span>{branch?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.DEPARTMENT),
        dataIndex: 'department',
        key: 'department',
        render: (department: IDepartment) => <span>{department?.name || 'N/A'}</span>,
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
        render: (faculty: IFaculty) => (
          <EntityActions
            onView={() => router.push(`/faculties/${faculty.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/faculties/${faculty.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeFaculty(faculty.id)}
            id={faculty.id}
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
          onRetry={() => loadFaculties({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IFaculty>} />
        </AsyncErrorBoundary>

        <FacultyFormDrawer
          mode={drawerMode}
          facultyId={selectedFacultyId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <FacultyDetailsDrawer
          facultyId={selectedDetailsFacultyId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
