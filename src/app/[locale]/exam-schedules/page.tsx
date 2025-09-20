'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import ExamScheduleDetailsDrawer from '@/components/examSchedules/ExamScheduleDetailsDrawer';
import ExamScheduleFormDrawer from '@/components/examSchedules/ExamScheduleFormDrawer';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';

import { useExamSchedules } from '@/hooks/useExamSchedules';
import { useLocalization } from '@/hooks/useLocalization';

import { IExamSchedule } from '@/types/examSchedule';

export default function ExamSchedulesPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.EXAM_SCHEDULE, { defaultValue: 'Exam Schedule' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedExamScheduleId, setSelectedExamScheduleId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsExamScheduleId, setSelectedDetailsExamScheduleId] = useState<
    number | undefined
  >();

  const { examSchedules, listStatus, pagination, loadExamSchedules, removeExamSchedule } =
    useExamSchedules();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');

  useEffect(() => {
    if (skip && limit) {
      const page = parseInt(skip) / parseInt(limit ?? '10') + 1;
      loadExamSchedules({ page, limit: parseInt(limit ?? '10') });
    } else {
      loadExamSchedules({ page: 1, limit: 10 });
    }
  }, [skip, limit, loadExamSchedules]);

  const handleEditDrawer = (examScheduleId: number) => {
    setSelectedExamScheduleId(examScheduleId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedExamScheduleId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExamSchedules({ page: 1, limit: 10 });
  };

  const handleViewDetails = (examScheduleId: number) => {
    setSelectedDetailsExamScheduleId(examScheduleId);
    setDetailsDrawerVisible(true);
  };

  const handleDetailsEdit = (examScheduleId: number) => {
    setDetailsDrawerVisible(false);
    setSelectedExamScheduleId(examScheduleId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IExamSchedule> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/exam-schedules',
    searchFields: ['remarks'] as (keyof IExamSchedule)[],
    onSearch: (searchText: string) => {
      loadExamSchedules({ page: 1, limit: 10, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: examSchedules,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
    columns: [
      {
        title: t(LOCALE_KEYS.EXAM),
        dataIndex: 'exam',
        key: 'exam',
        render: (exam: any) => <span>{exam?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.ROOM),
        dataIndex: 'room',
        key: 'room',
        render: (room: any) => <span>{room?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.FACULTY),
        dataIndex: 'faculty',
        key: 'faculty',
        render: (faculty: any) => <span>{faculty?.fullName || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.WEEK_DAY),
        dataIndex: 'weekDay',
        key: 'weekDay',
        render: (weekDay: any) => <span>{weekDay?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.TIME_SLOT),
        dataIndex: 'timeSlot',
        key: 'timeSlot',
        render: (timeSlot: any) => <span>{timeSlot?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.REMARKS),
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text: string) => <span>{text || 'N/A'}</span>,
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
        render: (examSchedule: IExamSchedule) => (
          <EntityActions
            onView={() => router.push(`/exam-schedules/${examSchedule.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/exam-schedules/${examSchedule.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeExamSchedule(examSchedule.id)}
            id={examSchedule.id}
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
          onRetry={() => loadExamSchedules({ page: 1, limit: 10 })}
        >
          <EntityList config={config as EntityConfig<IExamSchedule>} />
        </AsyncErrorBoundary>

        <ExamScheduleFormDrawer
          mode={drawerMode}
          examScheduleId={selectedExamScheduleId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />

        <ExamScheduleDetailsDrawer
          examScheduleId={selectedDetailsExamScheduleId}
          visible={detailsDrawerVisible}
          onClose={() => setDetailsDrawerVisible(false)}
          onEdit={handleDetailsEdit}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
