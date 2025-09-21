'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import ExamCandidateDetailsDrawer from '@/components/examCandidates/ExamCandidateDetailsDrawer';
import ExamCandidateFormDrawer from '@/components/examCandidates/ExamCandidateFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useExamCandidates } from '@/hooks/useExamCandidates';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamCandidate } from '@/types/examCandidate';

export default function ExamCandidatesPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_CANDIDATE, { defaultValue: 'Exam Candidate' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedExamCandidateId, setSelectedExamCandidateId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsExamCandidateId, setSelectedDetailsExamCandidateId] = useState<
    number | undefined
  >();

  const { examCandidates, listStatus, pagination, loadExamCandidates, removeExamCandidate } =
    useExamCandidates();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadExamCandidates({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadExamCandidates({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadExamCandidates]);

  const handleEditDrawer = (examCandidateId: number) => {
    setSelectedExamCandidateId(examCandidateId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedExamCandidateId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExamCandidates({ page: 1, limit: 10 });
  };

  const handleViewDetails = (examCandidateId: number) => {
    setSelectedDetailsExamCandidateId(examCandidateId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (examCandidateId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedExamCandidateId(examCandidateId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IExamCandidate> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/exam-candidates',
    searchFields: ['rollNo'] as (keyof IExamCandidate)[],
    onSearch: (searchText: string) => {
      loadExamCandidates({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: examCandidates,
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
        title: t(LOCALE_KEYS.STUDENT_ID),
        dataIndex: 'studentId',
        key: 'studentId',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.ROLL_NO),
        dataIndex: 'rollNo',
        key: 'rollNo',
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
        render: (examCandidate: IExamCandidate) => (
          <EntityActions
            onView={() => router.push(`/exam-candidates/${examCandidate.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/exam-candidates/${examCandidate.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeExamCandidate(examCandidate.id)}
            id={examCandidate.id}
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
          onRetry={() => loadExamCandidates({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IExamCandidate>} />
        </AsyncErrorBoundary>

        <ExamCandidateFormDrawer
          mode={drawerMode}
          examCandidateId={selectedExamCandidateId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <ExamCandidateDetailsDrawer
          examCandidateId={selectedDetailsExamCandidateId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
