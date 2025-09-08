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

export default function CourseAssignmentSubmissionsPage() {
  const { t } = useLocalization();
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

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadCourseAssignmentSubmissions({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadCourseAssignmentSubmissions({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadCourseAssignmentSubmissions]);

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
      loadCourseAssignmentSubmissions({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: courseAssignmentSubmissions,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
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
          record?.student?.name
            ? `${record.student.name} (${record.student.applicationNo})`
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
