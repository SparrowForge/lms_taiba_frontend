'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CourseAssignmentSubmissionDetailsDrawer from '@/components/courseAssignmentSubmissions/CourseAssignmentSubmissionDetailsDrawer';
import CourseAssignmentSubmissionFormDrawer from '@/components/courseAssignmentSubmissions/CourseAssignmentSubmissionFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useCourseAssignmentSubmissions } from '@/hooks/useCourseAssignmentSubmissions';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourseAssignmentSubmission } from '@/types/courseAssignmentSubmission';
import { useTranslations } from 'next-intl';
import { useStudents } from '@/hooks/useStudents';
import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { COURSE_ASSIGNMENT_SUBMISSION_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useCourses } from '@/hooks/useCourses';
import { useBatches } from '@/hooks/useBatches';
import { useSemesters } from '@/hooks/useSemesters';
import { useSubjects } from '@/hooks/useSubjects';

export default function CourseAssignmentSubmissionsPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT_SUBMISSION, {
    defaultValue: 'Course Assignment Submission',
  });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCourseAssignmentSubmissionId, setSelectedCourseAssignmentSubmissionId] = useState<
    number | undefined
  >();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [
    selectedDetailsCourseAssignmentSubmissionId,
    setSelectedDetailsCourseAssignmentSubmissionId,
  ] = useState<number | undefined>();

  const {
    courseAssignmentSubmissions,
    listStatus,
    pagination,
    loadCourseAssignmentSubmissions,
    removeCourseAssignmentSubmission,
  } = useCourseAssignmentSubmissions();

  const {students, loadStudents} = useStudents()
  const {courseAssignments, loadCourseAssignments} = useCourseAssignments()
  const {loadCourses, courses} = useCourses()
  const {loadSubjects, subjects} = useSubjects()

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const courseId = searchParams.get('courseId');
  const subjectId = searchParams.get('subjectId');

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
    delete params.courseId
    delete params.subjectId
    loadCourseAssignmentSubmissions({ page, limit: limitNum, ...params });
  };

  useEffect(()=>{
    loadCourses({page:1, limit:99})
  },[loadCourses])



  useEffect(()=>{
    if(courseId){
      loadSubjects({page:1, limit:99, courseId})
    }
  },[loadSubjects, courseId])

  useEffect(()=>{
    if(subjectId){
      loadCourseAssignments({page:1, limit:99, subjectId})
    }
  },[loadCourseAssignments, subjectId])

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadCourseAssignmentSubmissions]);



  useEffect(()=>{
    loadStudents({page:1, limit:99})
  },[loadStudents])

  const handleEditDrawer = (courseAssignmentSubmissionId: number) => {
    setSelectedCourseAssignmentSubmissionId(courseAssignmentSubmissionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedCourseAssignmentSubmissionId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadCourseAssignmentSubmissions({ page: 1, limit: 10 });
  };

  const handleViewDetails = (courseAssignmentSubmissionId: number) => {
    setSelectedDetailsCourseAssignmentSubmissionId(courseAssignmentSubmissionId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (courseAssignmentSubmissionId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedCourseAssignmentSubmissionId(courseAssignmentSubmissionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<ICourseAssignmentSubmission> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/course-assignment-submissions',
    searchFields: [
      'assignment.title',
      'student.name',
      'status',
    ] as (keyof ICourseAssignmentSubmission)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadCourseAssignmentSubmissions({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: courseAssignmentSubmissions,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    filters: [
          {
            key: 'status',
            label: t(LOCALE_KEYS.STATUS),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...COURSE_ASSIGNMENT_SUBMISSION_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
            ],
          },
          {
            key: 'studentId',
            label: t(LOCALE_KEYS.STUDENT_PROFILE),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...students.map((s) => ({ label: s.firstName , value: String(s.id) })),
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
              ...subjects.map((s) => ({ label: s.name, value: String(s.id) })),
            ],
          },
          {
            key: 'assignmentId',
            label: t(LOCALE_KEYS.COURSE_ASSIGNMENT),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...courseAssignments.map((b) => ({ label: b.subject.name, value: String(b.id) })),
            ],
          },
        ],
    columns: [
      {
        title: t(LOCALE_KEYS.ID),
        dataIndex: 'id',
        key: 'id',
        width: 80,
        sorter: true,
      },
      {
        title: t(LOCALE_KEYS.COURSE_ASSIGNMENT),
        key: 'assignment',
        width: 200,
        render: (text: string, record: ICourseAssignmentSubmission) =>
          record?.assignment?.title
            ? `${record.assignment.title} (${record.assignment.type})`
            : 'N/A',
      },
      {
        title: t(LOCALE_KEYS.STUDENT),
        key: 'student',
        width: 200,
        render: (text: string, record: ICourseAssignmentSubmission) =>
          record?.student?.firstName
            ? `${record.student.firstName} (${record.student.applicationNo})`
            : 'N/A',
      },
      {
        title: t(LOCALE_KEYS.SUBMITTED_AT),
        dataIndex: 'submittedAt',
        key: 'submittedAt',
        width: 150,
        sorter: true,
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.MARKS_OBTAINED),
        dataIndex: 'marksObtained',
        key: 'marksObtained',
        width: 120,
        sorter: true,
        render: (text: number) => text || 'N/A',
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: string) => <StatusTag status={status} />,
      },
      {
        title: t(LOCALE_KEYS.GRADER),
        key: 'grader',
        width: 150,
        render: (text: string, record: ICourseAssignmentSubmission) =>
          record?.grader?.fullName ? `${record.grader.fullName}` : 'N/A',
      },
      {
        title: t(LOCALE_KEYS.CREATED_AT),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        sorter: true,
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t(LOCALE_KEYS.ACTIONS),
        key: 'actions',
        width: 100,
        render: (courseAssignmentSubmission: ICourseAssignmentSubmission) => (
          <EntityActions
            onView={() =>
              router.push(`/course-assignment-submissions/${courseAssignmentSubmission.id}`)
            }
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() =>
              router.push(`/course-assignment-submissions/${courseAssignmentSubmission.id}/edit`)
            }
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeCourseAssignmentSubmission(courseAssignmentSubmission.id)}
            id={courseAssignmentSubmission.id}
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
          onRetry={() => loadCourseAssignmentSubmissions({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<ICourseAssignmentSubmission>} />
        </AsyncErrorBoundary>

        <CourseAssignmentSubmissionFormDrawer
          mode={drawerMode}
          courseAssignmentSubmissionId={selectedCourseAssignmentSubmissionId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />




        <CourseAssignmentSubmissionDetailsDrawer
          courseAssignmentSubmissionId={selectedDetailsCourseAssignmentSubmissionId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
