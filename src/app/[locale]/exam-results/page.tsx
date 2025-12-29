'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { EXAM_RESULT_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import ExamResultDetailsDrawer from '@/components/examResults/ExamResultDetailsDrawer';
import ExamResultFormDrawer from '@/components/examResults/ExamResultFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useBatches } from '@/hooks/useBatches';
import { useExamResults } from '@/hooks/useExamResults';
import { useExams } from '@/hooks/useExams';
import { useLocalization } from '@/hooks/useLocalization';
import { useSemesters } from '@/hooks/useSemesters';
import { useSubjects } from '@/hooks/useSubjects';

import { IExamResult } from '@/types/examResult';
import { useSemesterSubjects } from '../../../hooks/useSemesterSubjects';
import { useCourses } from '@/hooks/useCourses';
import { useExamTypes } from '@/hooks/useExamTypes';

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
  const { loadBatches, batches } = useBatches()
  const { loadSemesters, semesters } = useSemesters()
  const { loadSemesterSubjects, semesterSubjects } = useSemesterSubjects()
  const { loadExams, exams } = useExams()
  const { loadCourses, courses } = useCourses()
  const { loadExamTypes, examTypes } = useExamTypes()

  const { examResults, listStatus, pagination, loadExamResults, removeExamResult } =
    useExamResults();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const examId = searchParams.get('examId');
  const courseId = searchParams.get('courseId');
  const batchId = searchParams.get('batchId');
  const semesterId = searchParams.get('semesterId');
  const subjectId = searchParams.get('subjectId');
  const examTypeId = searchParams.get('examTypeId');


  const loadWithParams = (
    searchParams: URLSearchParams,
    skip: string | null,
    limit: string | null,
  ) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    delete params.courseId;
    delete params.batchId;
    delete params.semesterId;
    delete params.subjectId;
    delete params.examTypeId;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    loadExamResults({ page, limit: limitNum, ...params, examId });
  };

  useEffect(() => {
    loadCourses({ page: 1, limit: 99 })
  }, [loadCourses])

  useEffect(() => {
    loadExamTypes({ page: 1, limit: 99 })
  }, [loadExamTypes])

  useEffect(() => {
    if(courseId){
      loadBatches({ page: 1, limit: 99, courseId })
    }
  }, [loadBatches, courseId])

  useEffect(() => {
    if (batchId) {
      loadSemesters({ page: 1, limit: 99, batchId })
    }
  }, [batchId, loadSemesters])

  useEffect(() => {
    if (semesterId) {
      loadSemesterSubjects({ page: 1, limit: 99, semesterId })
    }
  }, [semesterId, loadSemesterSubjects])

  useEffect(() => {
    if (subjectId) {
      loadExams({ page: 1, limit: 99, courseId,  subjectId, semesterId, batchId, examTypeId })
    }
  }, [subjectId, loadExams, courseId, semesterId, batchId, examTypeId])


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
      {
        key: 'courseId',
        label: t(LOCALE_KEYS.COURSE),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...courses.map((c) => ({ label: c.name, value: String(c.id) })),
        ],
      },
      {
        key: 'batchId',
        label: t(LOCALE_KEYS.BATCH),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...batches.map((b) => ({ label: b.name, value: String(b.id) })),
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
          ...semesterSubjects.map((s) => ({ label: s.subject.name, value: String(s.subject.id) })),
        ],
      },
      {
        key: 'examTypeId',
        label: t(LOCALE_KEYS.EXAM_TYPE),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...examTypes.map((s) => ({ label: s.name, value: String(s.id) })),
        ],
      },
      {
        key: 'examId',
        label: t(LOCALE_KEYS.EXAM),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...exams.map((s) => ({ label: s.name, value: String(s.id) })),
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
