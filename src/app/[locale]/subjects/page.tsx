'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import SubjectDetailsDrawer from '@/components/subjects/SubjectDetailsDrawer';
import SubjectFormDrawer from '@/components/subjects/SubjectFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useLocalization} from '@/hooks/useLocalization';
import {useSubjects} from '@/hooks/useSubjects';

import {ICourse} from '@/types/course';
import {ISubject} from '@/types/subject';

export default function SubjectsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' });
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
    setDrawerVisible(false);
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/subjects',
    searchFields: ['name', 'code', 'status'] as (keyof ISubject)[],
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
        title: t(LOCALE_KEYS.CREDIT_HOURS),
        dataIndex: 'creditHours',
        key: 'creditHours',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.THEORY_HOURS),
        dataIndex: 'theoryHours',
        key: 'theoryHours',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.PRACTICAL_HOURS),
        dataIndex: 'practicalHours',
        key: 'practicalHours',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.COURSE),
        dataIndex: 'course',
        key: 'course',
        render: (course: ICourse) => <span>{course?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.PREREQUISITE),
        dataIndex: 'prerequisite',
        key: 'prerequisite',
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
        render: (subject: ISubject) => (
          <EntityActions
            onView={() => router.push(`/subjects/${subject.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/subjects/${subject.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
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
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
              : null
          }
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
