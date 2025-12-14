'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import ExamResultDetailsDrawer from '@/components/examResults/ExamResultDetailsDrawer';
import ExamResultFormDrawer from '@/components/examResults/ExamResultFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useExamResults } from '@/hooks/useExamResults';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamResult } from '@/types/examResult';
import { useTranslations } from 'next-intl';
import { EXAM_RESULT_STATUS_OPTIONS, STUDENT_STATUS_OPTIONS } from '@/constants/statusOptions';

export default function ExamResultsPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.EXAM_RESULT, { defaultValue: 'Exam Result' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedExamResultId, setSelectedExamResultId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsExamResultId, setSelectedDetailsExamResultId] = useState<
    number | undefined
  >();

  const { examResults, listStatus, pagination, loadExamResults, removeExamResult } =
    useExamResults();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const examId = searchParams.get('examId');

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
    loadExamResults({ page, limit: limitNum, ...params, examId });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadExamResults]);

  const handleEditDrawer = (examResultId: number) => {
    setSelectedExamResultId(examResultId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedExamResultId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExamResults({ page: 1, limit: 10 });
  };

  const handleViewDetails = (examResultId: number) => {
    setSelectedDetailsExamResultId(examResultId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (examResultId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedExamResultId(examResultId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IExamResult> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/exam-results',
    searchFields: ['grade', 'remarks'] as (keyof IExamResult)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadExamResults({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: examResults,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
        filters: [
          {
            key: 'status',
            label: t(LOCALE_KEYS.STATUS),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...EXAM_RESULT_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
            ],
          },
         
        ],
    columns: [
      {
        title: t(LOCALE_KEYS.EXAM_ID),
        dataIndex: 'examId',
        key: 'examId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.STUDENT_ID),
        dataIndex: 'studentId',
        key: 'studentId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.MARKS_OBTAINED),
        dataIndex: 'marksObtained',
        key: 'marksObtained',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.GRADE),
        dataIndex: 'grade',
        key: 'grade',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.REMARKS),
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text: string) => <span>{text}</span>,
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
        render: (examResult: IExamResult) => (
          <EntityActions
            onView={() => router.push(`/exam-results/${examResult.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/exam-results/${examResult.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeExamResult(examResult.id)}
            id={examResult.id}
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
          onRetry={() => loadExamResults({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IExamResult>} />
        </AsyncErrorBoundary>

        <ExamResultFormDrawer
          mode={drawerMode}
          examResultId={selectedExamResultId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <ExamResultDetailsDrawer
          examResultId={selectedDetailsExamResultId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
