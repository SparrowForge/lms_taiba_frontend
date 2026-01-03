'use client';

import { EditOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import AttendanceDetailsDrawer from '@/components/attendances/AttendanceDetailsDrawer';
import AttendanceFormDrawer from '@/components/attendances/AttendanceFormDrawer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useAttendances } from '@/hooks/useAttendances';
import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { useLocalization } from '@/hooks/useLocalization';
import { useSections } from '@/hooks/useSections';
import { useSubjects } from '@/hooks/useSubjects';

import { IAttendance } from '@/types/attendance';


export default function AttendancesPage() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsAttendanceId, setSelectedDetailsAttendanceId] = useState<
    number | undefined
  >();

  const { attendances, listStatus, pagination, loadAttendances, removeAttendance } =
    useAttendances();

  const { courses, loadCourses } = useCourses()
  const { subjects, loadSubjects } = useSubjects()
  const { batches, loadBatches } = useBatches()
  const { sections, loadSections } = useSections()

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const courseId = searchParams.get('courseId');
  const batchId = searchParams.get('batchId');


  const loadWithParams = (
    searchParams: URLSearchParams,
    skip: string | null,
    limit: string | null,
  ) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.skip;
    delete params.limit;
    delete params.batchId;
    delete params.sectionId;
    const limitNum = parseInt(limit ?? '10');
    const page = skip && limit ? parseInt(skip) / limitNum + 1 : 1;
    delete params.courseId
    loadAttendances({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadAttendances]);

  useEffect(() => {
    loadCourses({ page: 1, limit: 99 })
  }, [loadCourses])

  useEffect(() => {
    if (courseId) {
      loadSubjects({ page: 1, limit: 99, courseId: parseInt(courseId) })
    }
  }, [loadSubjects, courseId])

  useEffect(() => {
    if (courseId) {
      loadBatches({ page: 1, limit: 99, courseId: parseInt(courseId) })
    }
  }, [loadBatches, courseId])

  useEffect(() => {
    if (batchId) {
      loadSections({ page: 1, limit: 99, batchId: parseInt(batchId) })
    }
  }, [batchId, loadSections])

  const handleEditDrawer = (attendanceId: number) => {
    setSelectedAttendanceId(attendanceId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedAttendanceId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadAttendances({ page: 1, limit: 10 });
  };

  const handleViewDetails = (attendanceId: number) => {
    setSelectedDetailsAttendanceId(attendanceId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (attendanceId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedAttendanceId(attendanceId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IAttendance> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/attendances',
    searchFields: [
      'course.name',
      'subject.name',
      'faculty.fullName',
      'status',
    ] as (keyof IAttendance)[],
    onSearch: (searchText: string) => {
      loadAttendances({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: attendances,
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
          ...batches.map((s) => ({ label: s.name, value: String(s.id) })),
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
        key: 'sectionId',
        label: t(LOCALE_KEYS.SECTION),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...sections.map((s) => ({ label: s.name, value: String(s.id) })),
        ],
      },
    ],
    columns: [
      {
        title: t(LOCALE_KEYS.COURSE),
        key: 'course',
        width: 150,
        render: (text: string, record: IAttendance) =>
          record?.course?.name ? `${record.course.name} (${record.course.code})` : 'N/A',
      },
      {
        title: t(LOCALE_KEYS.SUBJECT),
        key: 'subject',
        width: 150,
        render: (text: string, record: IAttendance) =>
          record?.subject?.name ? `${record.subject.name} (${record.subject.code})` : 'N/A',
      },
      {
        title: t(LOCALE_KEYS.FACULTY),
        key: 'faculty',
        width: 150,
        render: (text: string, record: IAttendance) =>
          record?.faculty?.fullName ? `${record.faculty.fullName}` : 'N/A',
      },
      {
        title: t(LOCALE_KEYS.CLASS_NO),
        dataIndex: 'classNo',
        key: 'classNo',
        width: 100,
        sorter: true,
      },
      {
        title: t(LOCALE_KEYS.DATE),
        dataIndex: 'date',
        key: 'date',
        width: 120,
        sorter: true,
        render: (text: string) => new Date(text).toLocaleDateString(),
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: string) => <StatusTag status={status} />,
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
        render: (attendance: IAttendance) => (
          <EntityActions
            onView={() => router.push(`/attendances/${attendance.id}`)}
            onViewModal={handleViewDetails}
            viewText={t(LOCALE_KEYS.VIEW)}
            editText={t(LOCALE_KEYS.EDIT)}
            deleteText={t(LOCALE_KEYS.DELETE)}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/attendances/${attendance.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeAttendance(attendance.id)}
            id={attendance.id}
            extraActions={[
              {
                key: 'mark',
                icon: <EditOutlined />,
                label: t(LOCALE_KEYS.ATTENDANCE),
                onClick: () => router.push(`/attendances/${attendance.id}/mark`),
                disabled: false,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#1890ff',
                },
              },
            ]}
          />
        ),
      },
    ],
  };

  console.log(attendances);

  return (
    <ProtectedRoute>
      <MainLayout>
        <AsyncErrorBoundary
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
              : null
          }
          onRetry={() => loadAttendances({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IAttendance>} />
        </AsyncErrorBoundary>

        <AttendanceFormDrawer
          mode={drawerMode}
          attendanceId={selectedAttendanceId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <AttendanceDetailsDrawer
          attendanceId={selectedDetailsAttendanceId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
