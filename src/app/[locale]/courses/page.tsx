'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';


import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseDetailsDrawer from '@/components/courses/CourseDetailsDrawer';
import CourseFormDrawer from '@/components/courses/CourseFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import {EntityConfig, EntityList} from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import {useCourses} from '@/hooks/useCourses';

import {Status} from '@/types/common';
import {ICourse} from '@/types/course';
import {IDepartment} from '@/types/department';

export default function CoursesPage() {
  const t = useTranslations();
  const entityName = t('course', { defaultValue: 'Course' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsCourseId, setSelectedDetailsCourseId] = useState<number | undefined>();

  const { courses, listStatus, pagination, loadCourses, removeCourse } = useCourses();

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadCourses({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadCourses({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadCourses]);

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
    title: t('management_name', { name: entityName }),
    route: '/courses',
    searchFields: ['name', 'code', 'status'] as (keyof ICourse)[],
    onSearch: (searchText: string) => {
      loadCourses({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: courses,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t('name'),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('code'),
        dataIndex: 'code',
        key: 'code',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('courseType'),
        key: 'courseType',
        render: (course: ICourse) => <span>{course.courseType.name}</span>,
      },
      {
        title: t('scheduleType'),
        key: 'scheduleType',
        render: (course: ICourse) => <span>{course.scheduleType.name}</span>,
      },
      {
        title: t('durationInSemesters'),
        dataIndex: 'durationInSemesters',
        key: 'durationInSemesters',
        render: (text: number) => <span>{text}</span>,
      },
      {
        title: t('department'),
        dataIndex: 'department',
        key: 'department',
        render: (department: IDepartment) => <span>{department?.name || 'N/A'}</span>,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
      },
      {
        title: t('createdAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
      {
        title: t('actions'),
        key: 'actions',
        width: 100,
        render: (course: ICourse) => (
          <EntityActions
            onView={() => router.push(`/courses/${course.id}`)}
            onViewModal={handleViewDetails}
            viewText={t('view')}
            editText={t('edit')}
            deleteText={t('delete')}
            viewModalText={t('quickView')}
            onEdit={() => router.push(`/courses/${course.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t('quickEdit')}
            onDelete={() => removeCourse(course.id)}
            id={course.id}
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
              ? new Error(listStatus.message || t('failed_name', { name: entityName }))
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
