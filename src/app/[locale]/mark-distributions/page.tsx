'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import MarkDistributionDetailsDrawer from '@/components/markDistributions/MarkDistributionDetailsDrawer';
import MarkDistributionFormDrawer from '@/components/markDistributions/MarkDistributionFormDrawer';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useLocalization } from '@/hooks/useLocalization';
import { useMarkDistributions } from '@/hooks/useMarkDistributions';

import { IMarkDistribution } from '@/types/markDistribution';
import { useTranslations } from 'next-intl';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useCourses } from '@/hooks/useCourses';
import { useSubjects } from '@/hooks/useSubjects';
import { useExamTypes } from '@/hooks/useExamTypes';

export default function MarkDistributionsPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.MARK_DISTRIBUTION, { defaultValue: 'Mark Distribution' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedMarkDistributionId, setSelectedMarkDistributionId] = useState<
    number | undefined
  >();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsMarkDistributionId, setSelectedDetailsMarkDistributionId] = useState<
    number | undefined
  >();

  const {
    markDistributions,
    listStatus,
    pagination,
    loadMarkDistributions,
    removeMarkDistribution,
  } = useMarkDistributions();

  const {courses, loadCourses} = useCourses()
  const {subjects, loadSubjects} = useSubjects() 
  const {examTypes, loadExamTypes} = useExamTypes()

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
    loadMarkDistributions({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadMarkDistributions]);

  useEffect(()=>{
    loadCourses({page:1, limit:99})
  },[loadCourses])

  useEffect(()=>{
    loadExamTypes({page:1, limit:99})
  },[loadExamTypes])

  useEffect(()=>{
    loadSubjects({page:1, limit:99})
  },[loadSubjects])

  const handleEditDrawer = (markDistributionId: number) => {
    setSelectedMarkDistributionId(markDistributionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedMarkDistributionId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadMarkDistributions({ page: 1, limit: 10 });
  };

  const handleViewDetails = (markDistributionId: number) => {
    setSelectedDetailsMarkDistributionId(markDistributionId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (markDistributionId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedMarkDistributionId(markDistributionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IMarkDistribution> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/mark-distributions',
    searchFields: ['courseId', 'subjectId', 'examTypeId'] as (keyof IMarkDistribution)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadMarkDistributions({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: markDistributions,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
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
                  key: 'courseId',
                  label: t(LOCALE_KEYS.COURSE),
                  options: [
                    { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
                    ...courses.map((c) => ({ label: c.name, value: String(c.id) })),
                  ],
                },
                 {
                        key: 'subjectId',
                        label: t(LOCALE_KEYS.SUBJECT),
                        options: [
                          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
                          ...subjects.map((c) => ({ label: c.name, value: String(c.id) })),
                        ],
                      },
                       {
                              key: 'examTypeId',
                              label: t(LOCALE_KEYS.EXAM_TYPE),
                              options: [
                                { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
                                ...examTypes.map((c) => ({ label: c.name, value: String(c.id) })),
                              ],
                            },
        
        ],
    columns: [
      {
        title: t(LOCALE_KEYS.COURSE_ID),
        dataIndex: 'courseId',
        key: 'courseId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.SUBJECT_ID),
        dataIndex: 'subjectId',
        key: 'subjectId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.EXAM_TYPE_ID),
        dataIndex: 'examTypeId',
        key: 'examTypeId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.WEIGHTAGE),
        dataIndex: 'weightage',
        key: 'weightage',
        render: (text: number) => <span>{text}%</span>,
      },
      {
        title: t(LOCALE_KEYS.MAX_MARKS),
        dataIndex: 'maxMarks',
        key: 'maxMarks',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <span>{text}</span>,
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
        render: (markDistribution: IMarkDistribution) => (
          <EntityActions
            onView={() => router.push(`/mark-distributions/${markDistribution.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/mark-distributions/${markDistribution.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeMarkDistribution(markDistribution.id)}
            id={markDistribution.id}
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
          onRetry={() => loadMarkDistributions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IMarkDistribution>} />
        </AsyncErrorBoundary>

        <MarkDistributionFormDrawer
          mode={drawerMode}
          markDistributionId={selectedMarkDistributionId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <MarkDistributionDetailsDrawer
          markDistributionId={selectedDetailsMarkDistributionId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
