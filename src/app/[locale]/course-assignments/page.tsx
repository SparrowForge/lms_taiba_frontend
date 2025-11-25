'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ASSIGNMENT_TYPE_OPTIONS, Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CourseAssignmentDetailsDrawer from '@/components/courseAssignments/CourseAssignmentDetailsDrawer';
import CourseAssignmentFormDrawer from '@/components/courseAssignments/CourseAssignmentFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';
import {useTranslations} from 'next-intl';

import { useCourseAssignments } from '@/hooks/useCourseAssignments';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourseAssignment } from '@/types/courseAssignment';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useCourses } from '@/hooks/useCourses';
import { useBatches } from '@/hooks/useBatches';
import { useSubjects } from '@/hooks/useSubjects';
import { useFaculties } from '@/hooks/useFaculties';
import { useSemesters } from '@/hooks/useSemesters';

export default function CourseAssignmentsPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT, { defaultValue: 'Course Assignment' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCourseAssignmentId, setSelectedCourseAssignmentId] = useState<
    number | undefined
  >();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsCourseAssignmentId, setSelectedDetailsCourseAssignmentId] = useState<
    number | undefined
  >();

  const {
    courseAssignments,
    listStatus,
    pagination,
    loadCourseAssignments,
    removeCourseAssignment,
  } = useCourseAssignments();
  const {courses, loadCourses} = useCourses()
  const {batches, loadBatches} = useBatches()
  const {subjects, loadSubjects} = useSubjects()
  const {faculties, loadFaculties} = useFaculties()
  const {semesters, loadSemesters} = useSemesters()

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const courseId = searchParams.get("courseId")

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
    loadCourseAssignments({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadCourseAssignments]);

  useEffect(()=>{
    loadCourses({page:1, limit:99})
  },[loadCourses])

  useEffect(()=>{
    if(courseId){
      loadBatches({page:1, limit:99, courseId:parseInt(courseId)})
    }
  },[loadBatches, courseId])

  useEffect(()=>{
    loadSemesters({page:1, limit:99})
  },[loadSemesters])

  useEffect(()=>{
    loadSubjects({page:1, limit:99})
  },[loadSubjects])

  useEffect(()=>{
    loadFaculties({page:1, limit:99})
  },[loadFaculties])


  const handleEditDrawer = (courseAssignmentId: number) => {
    setSelectedCourseAssignmentId(courseAssignmentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedCourseAssignmentId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadCourseAssignments({ page: 1, limit: 10 });
  };

  const handleViewDetails = (courseAssignmentId: number) => {
    setSelectedDetailsCourseAssignmentId(courseAssignmentId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (courseAssignmentId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedCourseAssignmentId(courseAssignmentId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<ICourseAssignment> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/course-assignments',
    searchFields: ['title', 'type', 'status'] as (keyof ICourseAssignment)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadCourseAssignments({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: courseAssignments,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    filters: [
          {
            key: 'status',
            label: t(LOCALE_KEYS.STATUS),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...ENTITY_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
            ],
          },
           {
            key: 'type',
            label: t(LOCALE_KEYS.COURSE_ASSIGNMENT),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...ASSIGNMENT_TYPE_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
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
              ...subjects.map((s) => ({ label: s.name, value: String(s.id) })),
            ],
          },
          {
            key: 'facultyId',
            label: t(LOCALE_KEYS.FACULTY),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...faculties.map((f) => ({ label: f.fullName, value: String(f.id) })),
            ],
          },
        ],
    columns: [
      {
        title: t(LOCALE_KEYS.TITLE),
        dataIndex: 'title',
        key: 'title',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.COURSE),
        key: 'course',
        render: (courseAssignment: ICourseAssignment) => (
          <span>
            {courseAssignment.course.name} ({courseAssignment.course.code})
          </span>
        ),
      },
      {
        title: t(LOCALE_KEYS.SUBJECT),
        key: 'subject',
        render: (courseAssignment: ICourseAssignment) => (
          <span>
            {courseAssignment.subject.name} ({courseAssignment.subject.code})
          </span>
        ),
      },
      {
        title: t(LOCALE_KEYS.TYPE),
        dataIndex: 'type',
        key: 'type',
        render: (text: string) => <span>{translate(ASSIGNMENT_TYPE_OPTIONS.find(o => o.value === text)?.labelKey ?? '')}</span>,
      },
      {
        title: t(LOCALE_KEYS.TOTAL_MARKS),
        dataIndex: 'totalMarks',
        key: 'totalMarks',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.DUE_DATE),
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (text: string) => <span>{new Date(text).toLocaleDateString()}</span>,
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
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
        render: (courseAssignment: ICourseAssignment) => (
          <EntityActions
            onView={() => router.push(`/course-assignments/${courseAssignment.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/course-assignments/${courseAssignment.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeCourseAssignment(courseAssignment.id)}
            id={courseAssignment.id}
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
          onRetry={() => loadCourseAssignments({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<ICourseAssignment>} />
        </AsyncErrorBoundary>

        <CourseAssignmentFormDrawer
          mode={drawerMode}
          courseAssignmentId={selectedCourseAssignmentId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <CourseAssignmentDetailsDrawer
          courseAssignmentId={selectedDetailsCourseAssignmentId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
