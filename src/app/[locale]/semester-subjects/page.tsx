'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import SemesterSubjectDetailsDrawer from '@/components/semesterSubjects/SemesterSubjectDetailsDrawer';
import SemesterSubjectFormDrawer from '@/components/semesterSubjects/SemesterSubjectFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useLocalization } from '@/hooks/useLocalization';
import { useSemesterSubjects } from '@/hooks/useSemesterSubjects';

import { ISemester } from '@/types/semester';
import { ISemesterSubject } from '@/types/semesterSubject';
import { ISubject } from '@/types/subject';
import { useTranslations } from 'next-intl';
import { useSemesters } from '@/hooks/useSemesters';
import { useSubjects } from '@/hooks/useSubjects';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';

export default function SemesterSubjectsPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' });
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
  const {semesters, loadSemesters} = useSemesters()
  const {subjects, loadSubjects} = useSubjects()

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');


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
    loadSemesterSubjects({ page, limit: limitNum, ...params });

  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);

  }, [searchParams, skip, limit, loadSemesterSubjects]);


  useEffect(()=>{
    loadSemesters({ page:1, limit:99 })
  },[loadSemesters])

  useEffect(()=>{
    loadSubjects({ page:1, limit:99 })
  },[loadSubjects])

  

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
    setDrawerVisible(false);
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
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/semester-subjects',
    searchFields: ['semesterId', 'subjectId'] as (keyof ISemesterSubject)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadSemesterSubjects({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    // onQuickAdd: handleCreateDrawer,
    items: semesterSubjects,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.SEMESTER),
        dataIndex: 'semester',
        key: 'semester',
        render: (semester: ISemester) => <span>{semester?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.SUBJECT),
        dataIndex: 'subject',
        key: 'subject',
        render: (subject: ISubject) => <span>{subject?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.SUBJECT_CODE),
        dataIndex: 'subject',
        key: 'subjectCode',
        render: (subject: ISubject) => <span>{subject?.code || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.CREDIT_HOURS),
        dataIndex: 'subject',
        key: 'creditHours',
        render: (subject: ISubject) => <span>{subject?.creditHours || 'N/A'}</span>,
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
        render: (semesterSubject: ISemesterSubject) => (
          <EntityActions
            onView={() => router.push(`/semester-subjects/${semesterSubject.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            // onEdit={() => router.push(`/semester-subjects/${semesterSubject.id}/edit`)}
            // onEditModal={handleEditDrawer}
            // editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeSemesterSubject(semesterSubject.id)}
            id={semesterSubject.id}
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
            key: 'semesterId',
            label: t(LOCALE_KEYS.SEMESTER),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...semesters.map((s) => ({ label: s.name, value: String(s.id) })),
            ],
          },
          {
            key: 'subjectId',
            label: t(LOCALE_KEYS.SUBJECT),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...subjects.map((s) => ({ label: s.name, value: String(s.id) })),
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
