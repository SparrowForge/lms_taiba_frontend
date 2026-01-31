'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import ExamQuestionDetailsDrawer from '@/components/examQuestions/ExamQuestionDetailsDrawer';
import ExamQuestionFormDrawer from '@/components/examQuestions/ExamQuestionFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useExamQuestions } from '@/hooks/useExamQuestions';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamQuestion } from '@/types/examQuestion';

export default function ExamQuestionsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_QUESTION, { defaultValue: 'Exam Question' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedExamQuestionId, setSelectedExamQuestionId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsExamQuestionId, setSelectedDetailsExamQuestionId] = useState<
    number | undefined
  >();

  const { examQuestions, listStatus, pagination, loadExamQuestions, removeExamQuestion } =
    useExamQuestions();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadExamQuestions({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadExamQuestions({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadExamQuestions]);

  const handleEditDrawer = (examQuestionId: number) => {
    setSelectedExamQuestionId(examQuestionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedExamQuestionId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExamQuestions({ page: 1, limit: 10 });
  };

  const handleViewDetails = (examQuestionId: number) => {
    setSelectedDetailsExamQuestionId(examQuestionId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (examQuestionId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedExamQuestionId(examQuestionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IExamQuestion> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/exam-questions',
    searchFields: ['questionText'] as (keyof IExamQuestion)[],
    onSearch: (searchText: string) => {
      loadExamQuestions({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: examQuestions,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.EXAM_ID),
        dataIndex: 'examId',
        key: 'examId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.QUESTION_ORDER),
        dataIndex: 'questionOrder',
        key: 'questionOrder',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.QUESTION_TEXT),
        dataIndex: 'questionText',
        key: 'questionText',
        render: (text: string) => <span>{text?.slice(0, 50)}...</span>,
      },
      {
        title: t(LOCALE_KEYS.CORRECT_OPTION_NUMBER),
        dataIndex: 'correctOptionNumber',
        key: 'correctOptionNumber',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.OPTIONS),
        dataIndex: 'options',
        key: 'options',
        render: (text: string[]) => <span>{text?.length || 0} options</span>,
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
        render: (examQuestion: IExamQuestion) => (
          <EntityActions
            onView={() => router.push(`/exam-questions/${examQuestion.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/exam-questions/${examQuestion.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeExamQuestion(examQuestion.id)}
            id={examQuestion.id}
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
          onRetry={() => loadExamQuestions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IExamQuestion>} />
        </AsyncErrorBoundary>

        <ExamQuestionFormDrawer
          mode={drawerMode}
          examQuestionId={selectedExamQuestionId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <ExamQuestionDetailsDrawer
          examQuestionId={selectedDetailsExamQuestionId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
