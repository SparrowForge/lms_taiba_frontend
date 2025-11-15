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
import { useTranslations } from 'next-intl';
import { EXAM_CANDIDATE_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useStudents } from '@/hooks/useStudents';
import { useExams } from '@/hooks/useExams';

export default function ExamCandidatesPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.EXAM_CANDIDATE, { defaultValue: 'Exam Candidate' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedExamCandidateId, setSelectedExamCandidateId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsExamCandidateId, setSelectedDetailsExamCandidateId] = useState<
    number | undefined
  >();
  const {students, loadStudents} = useStudents()
  const {exams, loadExams} = useExams()

  const { examCandidates, listStatus, pagination, loadExamCandidates, removeExamCandidate } =
    useExamCandidates();

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
    loadExamCandidates({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadExamCandidates]);

  useEffect(() =>{
    loadStudents({page:1, limit:99})
  },[loadStudents])

  useEffect(() =>{
    loadExams({page:1, limit:99})
  },[loadExams])


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
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadExamCandidates({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: examCandidates,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    filters: [
          {
            key: 'status',
            label: t(LOCALE_KEYS.STATUS),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...EXAM_CANDIDATE_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
            ],
          },
          {
                  key: 'exmaId',
                  label: t(LOCALE_KEYS.EXAM),
                  options: [
                    { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
                    ...exams.map((c) => ({ label: c.name, value: String(c.id) })),
                  ],
          },
          {
            key: 'studentId',
            label: t(LOCALE_KEYS.STUDENT),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
                ...students.map((c) => ({ label: c.firstName, value: String(c.id) })),
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
