'use client';

import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import {ISubject} from '@/types/subject';
import {useSubjects} from '@/hooks/useSubjects';
import {useEffect, useState} from 'react';
import {Status} from '@/types/common';
import EntityActions from '@/components/ui/EntityActions';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useRouter, useSearchParams} from 'next/navigation';
import SubjectFormDrawer from '@/components/subjects/SubjectFormDrawer';
import SubjectDetailsDrawer from '@/components/subjects/SubjectDetailsDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {useTranslations} from 'next-intl';
import {ICourse} from '@/types/course';

export default function SubjectsPage() {
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsSubjectId, setSelectedDetailsSubjectId] = useState<number | undefined>();

  const { subjects, listStatus, pagination, loadSubjects, removeSubject } = useSubjects();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadSubjects({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadSubjects({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadSubjects]);

  const handleEditDrawer = (subjectId: number) => {
    setSelectedSubjectId(subjectId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedSubjectId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    loadSubjects({ page: 1, limit: 10 });
  };

  const handleViewDetails = (subjectId: number) => {
    setSelectedDetailsSubjectId(subjectId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (subjectId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedSubjectId(subjectId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<ISubject> = {
    name: entityName,
    title: t('managemen_name', { name: entityName }),
    route: '/subjects',
    searchFields: ['name', 'code', 'course.name'] as (keyof ISubject)[],
    onSearch: (searchText: string) => {
      loadSubjects({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: subjects,
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
        title: t('creditHours'),
        dataIndex: 'creditHours',
        key: 'creditHours',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('theoryHours'),
        dataIndex: 'theoryHours',
        key: 'theoryHours',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('practicalHours'),
        dataIndex: 'practicalHours',
        key: 'practicalHours',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('course'),
        dataIndex: 'course',
        key: 'course',
        render: (course: ICourse) => <span>{course?.name || 'N/A'}</span>,
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
        render: (subject: ISubject) => (
          <EntityActions
            onView={() => router.push(`/subjects/${subject.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/subjects/${subject.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeSubject(subject.id)}
            id={subject.id}
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
          onRetry={() => loadSubjects({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<ISubject>} />
        </AsyncErrorBoundary>

        <SubjectFormDrawer
          mode={drawerMode}
          subjectId={selectedSubjectId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <SubjectDetailsDrawer
          subjectId={selectedDetailsSubjectId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
