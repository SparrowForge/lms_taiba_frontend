'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useLocalization } from '@/hooks/useLocalization';
import { useQuestionSets } from '@/hooks/useQuestionSets';

import { IQuestionSet } from '@/types/questionSet';
import QuestionSetDetailsDrawer from '@/components/questionSet/QuestionSetDetailsDrawer';
import QuestionSetFormDrawer from '@/components/questionSet/QuestionSetFormDrawer';

import { useTranslations } from 'next-intl';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';

export default function QuestionSetsPage() {
  const router = useRouter();
  const translate = useTranslations();
  const { t } = useLocalization();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedQSetId, setSelectedQSetId] = useState<number | undefined>();

  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const entityName = 'Question Set';

  const { questionSets, listStatus, pagination, loadQuestionSets, removeQuestionSet } =
    useQuestionSets();

  // Pagination handlers from URL
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  const loadWithParams = (
    searchParams: URLSearchParams,
    skip: string | null,
    limit: string | null
  ) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;

    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;

    loadQuestionSets({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadQuestionSets]);

  // Drawer handlers
  const handleEditDrawer = (id: number) => {
    setSelectedQSetId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedQSetId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadQuestionSets({ page: 1, limit: 10 });
  };

  const handleViewDetails = (id: number) => {
    setSelectedDetailsId(id);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (id: number) => {
    setDetailsDrawerVisible(false);
    handleEditDrawer(id);
  };

  // Table config
  const config: EntityConfig<IQuestionSet> = {
    name: entityName,
    title: 'Question Set Management',
    route: '/question-sets',
    searchFields: ['name', 'status'] as (keyof IQuestionSet)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;

      loadQuestionSets({
        page: 1,
        limit: parseInt(limit ?? '10'),
        ...params,
        search: searchText,
      });
    },
    onQuickAdd: handleCreateDrawer,
    items: questionSets,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,

    filters: [
      {
        key: 'status',
        label: t(LOCALE_KEYS.STATUS),
        options: [
          { label: 'All', value: '' },
          ...ENTITY_STATUS_OPTIONS.map((s) => ({
            label: translate(s.labelKey),
            value: s.value,
          })),
        ],
      },
    ],

    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Course',
        key: 'course',
        render: (q: IQuestionSet) => q.course?.name,
      },
      {
        title: 'Subject',
        key: 'subject',
        render: (q: IQuestionSet) => q.subject?.name,
      },
      {
        title: 'Exam',
        key: 'exam',
        render: (q: IQuestionSet) => q.exam?.name,
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 100,
        render: (qSet: IQuestionSet) => (
          <EntityActions
            onView={() => router.push(`/question-sets/${qSet.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/question-sets/${qSet.id}/edit`)}
            editText={t(LOCALE_KEYS.EDIT)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeQuestionSet(qSet.id)}
            id={qSet.id}
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
              ? new Error(listStatus.message || 'Failed to load Question Sets')
              : null
          }
          onRetry={() => loadQuestionSets({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IQuestionSet>} />
        </AsyncErrorBoundary>

        {/* <QuestionSetFormDrawer
          mode={drawerMode}
          questionSetId={selectedQSetId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <QuestionSetDetailsDrawer
          questionSetId={selectedDetailsId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        /> */}
      </MainLayout>
    </ProtectedRoute>
  );
}
