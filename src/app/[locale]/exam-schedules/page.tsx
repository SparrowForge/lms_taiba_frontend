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
import { useTranslations } from 'next-intl';
import { useRooms } from '@/hooks/useRooms';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { useWeekDays } from '@/hooks/useWeekDays';
import { useFaculties } from '@/hooks/useFaculties';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';

export default function ExamSchedulesPage() {
  const { t } = useLocalization();
  const translate = useTranslations()
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
  const {rooms,loadRooms} = useRooms()
  const {timeSlots,loadTimeSlots} = useTimeSlots()
  const {weekDays, loadWeekDays} = useWeekDays()
  const {faculties, loadFaculties} = useFaculties()

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
    loadExamSchedules({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadExamSchedules]);

  useEffect(()=>{
    loadRooms({page:1, limit:99})
  },[loadRooms])

  useEffect(()=>{
    loadFaculties({page:1, limit:99})
  },[loadFaculties])

    useEffect(()=>{
    loadWeekDays({page:1, limit:99})
  },[loadWeekDays])

  useEffect(()=>{
    loadTimeSlots({page:1, limit:99})
  },[loadTimeSlots])

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
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadExamSchedules({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: examSchedules,
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
            key: 'roomId',
            label: t(LOCALE_KEYS.EXAM),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...rooms.map((r) => ({ label: r.name, value: String(r.id) })),
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
          {
            key: 'weekDayId',
            label: t(LOCALE_KEYS.WEEK_DAY),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...weekDays.map((w) => ({ label: w.name, value: String(w.id) })),
            ],
          },
          {
            key: 'timeSlotId',
            label: t(LOCALE_KEYS.TIME_SLOT),
            options: [
              { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
              ...timeSlots.map((t) => ({ label: t.name, value: String(t.id) })),
            ],
          },
        ],
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
