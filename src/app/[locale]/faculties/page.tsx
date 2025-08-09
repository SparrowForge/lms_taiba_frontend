'use client';

import {Tag} from 'antd';
import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import FacultyDetailsDrawer from '@/components/faculties/FacultyDetailsDrawer';
import FacultyFormDrawer from '@/components/faculties/FacultyFormDrawer';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useFaculties} from '@/hooks/useFaculties';

import {IBranch} from '@/types/branch';
import {Status} from '@/types/common';
import {IDepartment} from '@/types/department';
import {IFaculty} from '@/types/faculty';

export default function FacultyPage() {
  const t = useTranslations();
  const entityName = t('faculty', { defaultValue: 'Faculty' });
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
    title: t('managemen_name', { name: entityName }),
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
        title: t('fullName'),
        dataIndex: 'fullName',
        key: 'fullName',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('email'),
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('employeeCode'),
        dataIndex: 'employeeCode',
        key: 'employeeCode',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('employmentType'),
        dataIndex: 'employmentType',
        key: 'employmentType',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('status'),
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive: boolean) => (
          <Tag color={isActive ? 'green' : 'red'}>{isActive ? t('active') : t('inactive')}</Tag>
        ),
      },
      {
        title: t('branch'),
        dataIndex: 'branch',
        key: 'branch',
        render: (branch: IBranch) => <span>{branch?.name || 'N/A'}</span>,
      },
      {
        title: t('department'),
        dataIndex: 'department',
        key: 'department',
        render: (department: IDepartment) => <span>{department?.name || 'N/A'}</span>,
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
        render: (faculty: IFaculty) => (
          <EntityActions
            onView={() => router.push(`/faculties/${faculty.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/faculties/${faculty.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
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
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
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
