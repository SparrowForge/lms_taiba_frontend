'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import SemesterSubjectDetailsDrawer from '@/components/semesterSubjects/SemesterSubjectDetailsDrawer';
import SemesterSubjectFormDrawer from '@/components/semesterSubjects/SemesterSubjectFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';

import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

import {Status} from '@/types/common';
import {ISemester} from '@/types/semester';
import {ISemesterSubject} from '@/types/semesterSubject';
import {ISubject} from '@/types/subject';

export default function SemesterSubjectsPage() {
  const t = useTranslations();
  const entityName = t('semesterSubject', { defaultValue: 'Semester Subject' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedSemesterSubjectId, setSelectedSemesterSubjectId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsSemesterSubjectId, setSelectedDetailsSemesterSubjectId] = useState<
    number | undefined
  >();

  const { semesterSubjects, listStatus, pagination, loadSemesterSubjects, removeSemesterSubject } =
    useSemesterSubjects();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadSemesterSubjects({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadSemesterSubjects({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadSemesterSubjects]);

  const handleEditDrawer = (semesterSubjectId: number) => {
    setSelectedSemesterSubjectId(semesterSubjectId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedSemesterSubjectId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadSemesterSubjects({ page: 1, limit: 10 });
  };

  const handleViewDetails = (semesterSubjectId: number) => {
    setSelectedDetailsSemesterSubjectId(semesterSubjectId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (semesterSubjectId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedSemesterSubjectId(semesterSubjectId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<ISemesterSubject> = {
    name: entityName,
    title: t('management_name', { name: entityName }),
    route: '/semester-subjects',
    searchFields: ['semesterId', 'subjectId'] as (keyof ISemesterSubject)[],
    onSearch: (searchText: string) => {
      loadSemesterSubjects({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: semesterSubjects,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('semester'),
        dataIndex: 'semester',
        key: 'semester',
        render: (semester: ISemester) => <span>{semester?.name || 'N/A'}</span>,
      },
      {
        title: t('subject'),
        dataIndex: 'subject',
        key: 'subject',
        render: (subject: ISubject) => <span>{subject?.name || 'N/A'}</span>,
      },
      {
        title: t('subjectCode'),
        dataIndex: 'subject',
        key: 'subjectCode',
        render: (subject: ISubject) => <span>{subject?.code || 'N/A'}</span>,
      },
      {
        title: t('creditHours'),
        dataIndex: 'subject',
        key: 'creditHours',
        render: (subject: ISubject) => <span>{subject?.creditHours || 'N/A'}</span>,
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
        render: (semesterSubject: ISemesterSubject) => (
          <EntityActions
            onView={() => router.push(`/semester-subjects/${semesterSubject.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/semester-subjects/${semesterSubject.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeSemesterSubject(semesterSubject.id)}
            id={semesterSubject.id}
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
          onRetry={() => loadSemesterSubjects({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<ISemesterSubject>} />
        </AsyncErrorBoundary>

        <SemesterSubjectFormDrawer
          mode={drawerMode}
          semesterSubjectId={selectedSemesterSubjectId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <SemesterSubjectDetailsDrawer
          semesterSubjectId={selectedDetailsSemesterSubjectId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
