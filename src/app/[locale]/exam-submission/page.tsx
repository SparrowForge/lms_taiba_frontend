'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdRateReview } from 'react-icons/md';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';
import { EXAM_SUBMISSION_STATUS_OPTIONS } from '@/enums/exam-submission.enum';

import AddressDetailsDrawer from '@/components/addresses/AddressDetailsDrawer';
import AddressFormDrawer from '@/components/addresses/AddressFormDrawer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';



import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useExams } from '@/hooks/useExams';
import { useExamSubmissions } from '@/hooks/useExamSubmissions';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';
import { useSubjects } from '@/hooks/useSubjects';

import { IExamSubmission } from '@/types/examSubmission';



export default function ExamSubmissionPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SUBMISSION, { defaultValue: 'Exam Submission' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsAddressId, setSelectedDetailsAddressId] = useState<number | undefined>();

  const { listStatus, pagination, loadExamSubmissions, examSubmissions, removeExamSubmission } = useExamSubmissions();
  const { courses, loadCourses } = useCourses()
  const { subjects, loadSubjects } = useSubjects()
  const { batches, loadBatches } = useBatches()
  const { students, loadStudents } = useStudents()
  const { exams, loadExams } = useExams()

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const courseId = searchParams.get('courseId');
  const batchId = searchParams.get('batchId');
  const subjectId = searchParams.get('subjectId');



  const loadWithParams = (
    searchParams: URLSearchParams,
    skip: string | null,
    limit: string | null,
  ) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    delete params.batchId;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    loadExamSubmissions({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadExamSubmissions]);

  const handleEditDrawer = (addressId: number) => {
    setSelectedAddressId(addressId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  useEffect(() => {
    loadCourses({ page: 1, limit: 99 })
  }, [loadCourses])

  useEffect(() => {
    if(courseId){
      loadBatches({ page: 1, limit: 99, courseId: parseInt(courseId) })
    }
  }, [loadBatches,courseId])

  useEffect(() => {
    if(batchId){
      loadStudents({ page: 1, limit: 99, batchId: parseInt(batchId) })
    }
  }, [loadStudents,batchId])

  useEffect(() => {
    if(courseId || batchId || subjectId){
      loadExams({ page: 1, limit: 99, batchId: parseInt(batchId), courseId: parseInt(courseId), subjectId: parseInt(subjectId) })
    }
  }, [loadExams, batchId, courseId, subjectId])

  useEffect(() => {
    loadSubjects({ page: 1, limit: 99 })
  }, [loadSubjects])

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExamSubmissions({ page: 1, limit: 10 });
  };

  const handleViewDetails = (addressId: number) => {
    setSelectedDetailsAddressId(addressId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (addressId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedAddressId(addressId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleReviewExamSubmission = (examSubmissionId: number) => {
    router.push(`/exam-submission/review?submissionId=${examSubmissionId}`);
  }

  const config: EntityConfig<IExamSubmission> = {
    name: entityName,
    title: t(LOCALE_KEYS.EXAM_SUBMISSION, { name: entityName }),
    route: '/exam-submission',
    searchFields: ['exam'] as (keyof IExamSubmission)[],
    onSearch: (searchText: string) => {
      loadExamSubmissions({ page: 1, limit: 10, search: searchText });
    },

    items: examSubmissions,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.NAME, { defaultValue: 'Name' }),
        key: 'name',
        render: (data: IExamSubmission) => (
          <span>
            {data.exam.name}
          </span>
        ),
      },
      {
        title: t(LOCALE_KEYS.STATE),
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
        render: (examSubmission: IExamSubmission) => (
          <EntityActions
            onView={() => router.push(`/addresses/${examSubmission.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/addresses/${examSubmission.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeExamSubmission(examSubmission.id)}
            id={examSubmission.id}
            extraActions={[
              {
                key: 'assignReview',
                icon: <MdRateReview />,
                label: t(LOCALE_KEYS.REVIEW),
                onClick: () => handleReviewExamSubmission(examSubmission.id),
              }

            ]}
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
          ...EXAM_SUBMISSION_STATUS_OPTIONS.map((s) => ({ label: t(s.value), value: s.value })),
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
        key: 'subjectId',
        label: t(LOCALE_KEYS.SUBJECT),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...subjects.map((b) => ({ label: b.name, value: String(b.id) })),
        ],
      },
      {
        key: 'examId',
        label: t(LOCALE_KEYS.EXAM),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...exams.map((b) => ({ label: b.name, value: String(b.id) })),
        ],
      },
      {
        key: 'studentId',
        label: t(LOCALE_KEYS.STUDENT),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...students.map((s) => ({ label: (s.firstName + ' ' + s.lastName), value: String(s.id) })),
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
          onRetry={() => loadExamSubmissions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IExamSubmission>} />
        </AsyncErrorBoundary>



        <AddressFormDrawer
          mode={drawerMode}
          addressId={selectedAddressId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <AddressDetailsDrawer
          addressId={selectedDetailsAddressId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
