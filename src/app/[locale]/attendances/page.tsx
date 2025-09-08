'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
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
import { useLocalization } from '@/hooks/useLocalization';

import { IAttendance } from '@/types/attendance';

export default function AttendancesPage() {
  const { t } = useLocalization();
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

  //get skip & limit from url
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadAttendances({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadAttendances({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadAttendances]);

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
