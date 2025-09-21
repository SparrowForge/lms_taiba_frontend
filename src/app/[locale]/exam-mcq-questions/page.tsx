'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import ExamMCQQuestionDetailsDrawer from '@/components/examMCQQuestions/ExamMCQQuestionDetailsDrawer';
import ExamMCQQuestionFormDrawer from '@/components/examMCQQuestions/ExamMCQQuestionFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useExamMCQQuestions } from '@/hooks/useExamMCQQuestions';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamMCQQuestion } from '@/types/examMCQQuestion';

export default function ExamMCQQuestionsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_MCQ_QUESTION, { defaultValue: 'Exam MCQ Question' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedExamMCQQuestionId, setSelectedExamMCQQuestionId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsExamMCQQuestionId, setSelectedDetailsExamMCQQuestionId] = useState<
    number | undefined
  >();

  const { examMCQQuestions, listStatus, pagination, loadExamMCQQuestions, removeExamMCQQuestion } =
    useExamMCQQuestions();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadExamMCQQuestions({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadExamMCQQuestions({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadExamMCQQuestions]);

  const handleEditDrawer = (examMCQQuestionId: number) => {
    setSelectedExamMCQQuestionId(examMCQQuestionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedExamMCQQuestionId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExamMCQQuestions({ page: 1, limit: 10 });
  };

  const handleViewDetails = (examMCQQuestionId: number) => {
    setSelectedDetailsExamMCQQuestionId(examMCQQuestionId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (examMCQQuestionId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedExamMCQQuestionId(examMCQQuestionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IExamMCQQuestion> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/exam-mcq-questions',
    searchFields: ['questionText'] as (keyof IExamMCQQuestion)[],
    onSearch: (searchText: string) => {
      loadExamMCQQuestions({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: examMCQQuestions,
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
        render: (examMCQQuestion: IExamMCQQuestion) => (
          <EntityActions
            onView={() => router.push(`/exam-mcq-questions/${examMCQQuestion.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/exam-mcq-questions/${examMCQQuestion.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeExamMCQQuestion(examMCQQuestion.id)}
            id={examMCQQuestion.id}
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
          onRetry={() => loadExamMCQQuestions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IExamMCQQuestion>} />
        </AsyncErrorBoundary>

        <ExamMCQQuestionFormDrawer
          mode={drawerMode}
          examMCQQuestionId={selectedExamMCQQuestionId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <ExamMCQQuestionDetailsDrawer
          examMCQQuestionId={selectedDetailsExamMCQQuestionId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
