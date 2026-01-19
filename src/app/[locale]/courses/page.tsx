'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CourseDetailsDrawer from '@/components/courses/CourseDetailsDrawer';
import CourseFormDrawer from '@/components/courses/CourseFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useCourses } from '@/hooks/useCourses';
import { useLocalization } from '@/hooks/useLocalization';

import { ICourse } from '@/types/course';
import { IDepartment } from '@/types/department';
import { useTranslations } from 'next-intl';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { useCourseTypes } from '@/hooks/useCourseTypes';
import { useDepartments } from '@/hooks/useDepartments';
import { useSemesters } from '@/hooks/useSemesters';

export default function CoursesPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsCourseId, setSelectedDetailsCourseId] = useState<number | undefined>();

  const { courses, listStatus, pagination, loadCourses, removeCourse } = useCourses();
  const {courseTypes,loadCourseTypes} = useCourseTypes()
  const {departments,loadDepartments} = useDepartments()


  //get skip & limit from url
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
    loadCourses({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadCourses]);

  useEffect(() => {
    loadCourseTypes({ page: 1, limit: 99 });
  }, [loadCourseTypes]);

  useEffect(() => {
    loadDepartments({ page: 1, limit: 99 });
  }, [loadDepartments]);

  const handleEditDrawer = (courseId: number) => {
    setSelectedCourseId(courseId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedCourseId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadCourses({ page: 1, limit: 10 });
  };

  const handleViewDetails = (courseId: number) => {
    setSelectedDetailsCourseId(courseId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (courseId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedCourseId(courseId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<ICourse> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/courses',
    searchFields: ['name', 'code', 'status'] as (keyof ICourse)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadCourses({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: courses,
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
        title: t(LOCALE_KEYS.CODE),
        dataIndex: 'code',
        key: 'code',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.COURSE_TYPE),
        key: 'courseType',
        render: (course: ICourse) => <span>{course?.courseType?.name}</span>,
      },
      {
        title: t(LOCALE_KEYS.SCHEDULE_TYPE),
        key: 'scheduleType',
        render: (course: ICourse) => <span>{course?.scheduleType?.name}</span>,
      },
      {
        title: t(LOCALE_KEYS.DURATION_IN_SEMESTERS),
        dataIndex: 'durationInSemesters',
        key: 'durationInSemesters',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t(LOCALE_KEYS.DEPARTMENT),
        dataIndex: 'department',
        key: 'department',
        render: (department: IDepartment) => <span>{department?.name || 'N/A'}</span>,
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
        render: (course: ICourse) => (
          <EntityActions
            onView={() => router.push(`/courses/${course.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/courses/${course.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeCourse(course.id)}
            id={course.id}
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
              ...ENTITY_STATUS_OPTIONS.map((s) => ({ label: translate(s.labelKey), value: s.value })),
            ],
          },
          {
            key: 'courseType',
            label: t(LOCALE_KEYS.COURSE_TYPE),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...courseTypes.map((c) => ({ label: c.name, value: String(c.name) })),
            ],
          },
          {
            key: 'department',
            label: t(LOCALE_KEYS.DEPARTMENT),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...departments.map((d) => ({ label: d.name, value: String(d.name) })),
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
          onRetry={() => loadCourses({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<ICourse>} />
        </AsyncErrorBoundary>

        <CourseFormDrawer
          mode={drawerMode}
          courseId={selectedCourseId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <CourseDetailsDrawer
          courseId={selectedDetailsCourseId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
