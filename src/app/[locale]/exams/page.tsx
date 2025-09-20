'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import ExamDetailsDrawer from '@/components/exams/ExamDetailsDrawer';
import ExamFormDrawer from '@/components/exams/ExamFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';

import { IExam } from '@/types/exam';

export default function ExamsPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM, { defaultValue: 'Exam' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedExamId, setSelectedExamId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsExamId, setSelectedDetailsExamId] = useState<number | undefined>();

  const { exams, listStatus, pagination, loadExams, removeExam } = useExams();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadExams({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadExams({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadExams]);

  const handleEditDrawer = (examId: number) => {
    setSelectedExamId(examId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedExamId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExams({ page: 1, limit: 10 });
  };

  const handleViewDetails = (examId: number) => {
    setSelectedDetailsExamId(examId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (examId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedExamId(examId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IExam> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/exams',
    searchFields: ['name', 'questionType'] as (keyof IExam)[],
    onSearch: (searchText: string) => {
      loadExams({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: exams,
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
        title: t(LOCALE_KEYS.MARKS),
        dataIndex: 'marks',
        key: 'marks',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.EXAM_DATETIME),
        dataIndex: 'examDatetime',
        key: 'examDatetime',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.QUESTION_TYPE),
        dataIndex: 'questionType',
        key: 'questionType',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.QUESTIONS_COUNT),
        dataIndex: 'questionsCount',
        key: 'questionsCount',
        render: (text: number) => <span>{text}</span>,
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
        render: (exam: IExam) => (
          <EntityActions
            onView={() => router.push(`/exams/${exam.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/exams/${exam.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeExam(exam.id)}
            id={exam.id}
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
          onRetry={() => loadExams({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IExam>} />
        </AsyncErrorBoundary>

        <ExamFormDrawer
          mode={drawerMode}
          examId={selectedExamId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <ExamDetailsDrawer
          examId={selectedDetailsExamId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
