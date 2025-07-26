'use client';

import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import {IFacultySubject} from '@/types/facultySubject';
import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {useEffect, useState} from 'react';
import {Status} from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRouter} from 'next/navigation';
import FacultySubjectFormDrawer from '@/components/facultySubjects/FacultySubjectFormDrawer';
import FacultySubjectDetailsDrawer from '@/components/facultySubjects/FacultySubjectDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {useTranslations} from 'next-intl';
import {Tag} from 'antd';

export default function FacultySubjectsPage() {
  const t = useTranslations();
  const entityName = t('facultySubject', { defaultValue: 'Faculty Subject' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedFacultySubjectId, setSelectedFacultySubjectId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsFacultySubjectId, setSelectedDetailsFacultySubjectId] = useState<number | undefined>();

  const { facultySubjects, listStatus, pagination, loadFacultySubjects, removeFacultySubject } = useFacultySubjects();

  useEffect(() => {
    loadFacultySubjects({ page: 1, limit: 10 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditDrawer = (facultySubjectId: number) => {
    setSelectedFacultySubjectId(facultySubjectId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedFacultySubjectId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadFacultySubjects({ page: 1, limit: 10 });
  };

  const handleViewDetails = (facultySubjectId: number) => {
    setSelectedDetailsFacultySubjectId(facultySubjectId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (facultySubjectId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedFacultySubjectId(facultySubjectId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IFacultySubject> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/faculty-subjects',
    searchFields: [] as (keyof IFacultySubject)[],
    onSearch: (searchText: string) => {
      loadFacultySubjects({ page: 1, limit: 10, search: searchText });
    },
    onAdd: handleCreateDrawer,
    items: facultySubjects,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('faculty'),
        key: 'faculty',
        render: (facultySubject: IFacultySubject) => (
          <div>
            <div>{facultySubject.faculty?.fullName || 'N/A'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {facultySubject.faculty?.employeeCode || 'N/A'}
            </div>
          </div>
        ),
      },
      {
        title: t('subject'),
        key: 'subject',
        render: (facultySubject: IFacultySubject) => (
          <div>
            <div>{facultySubject.subject?.name || 'N/A'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {facultySubject.subject?.code || 'N/A'}
            </div>
          </div>
        ),
      },
      {
        title: t('semester'),
        key: 'semester',
        render: (facultySubject: IFacultySubject) => (
          <span>{facultySubject.semester?.name || 'N/A'}</span>
        ),
      },
      {
        title: t('batch'),
        key: 'batch',
        render: (facultySubject: IFacultySubject) => (
          <span>{facultySubject.batch?.name || 'N/A'}</span>
        ),
      },
      {
        title: t('hoursPerWeek'),
        dataIndex: 'hoursPerWeek',
        key: 'hoursPerWeek',
        render: (hoursPerWeek: number) => <span>{hoursPerWeek}</span>,
      },
      {
        title: t('role'),
        dataIndex: 'role',
        key: 'role',
        render: (role: string) => (
          <Tag color={role === 'instructor' ? 'blue' : role === 'assistant' ? 'green' : role === 'coordinator' ? 'purple' : 'orange'}>
            {(role)}
          </Tag>
        ),
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
        render: (facultySubject: IFacultySubject) => (
          <EntityActions
            onView={() => router.push(`/faculty-subjects/${facultySubject.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/faculty-subjects/${facultySubject.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeFacultySubject(facultySubject.id)}
            id={facultySubject.id}
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
          onRetry={() => loadFacultySubjects({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IFacultySubject>} />
        </AsyncErrorBoundary>

        <FacultySubjectFormDrawer
          open={drawerVisible}
          mode={drawerMode}
          facultySubjectId={selectedFacultySubjectId}
          onClose={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <FacultySubjectDetailsDrawer
          facultySubjectId={selectedDetailsFacultySubjectId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
