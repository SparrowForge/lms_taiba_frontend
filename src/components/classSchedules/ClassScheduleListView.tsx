'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';


import ClassScheduleDetailsDrawer from '@/components/classSchedules/ClassScheduleDetailsDrawer';
import ClassScheduleFormDrawer from '@/components/classSchedules/ClassScheduleFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import StatusTag from '@/components/ui/StatusTag';

import { useBatches } from '@/hooks/useBatches';
import { useClassSchedules } from '@/hooks/useClassSchedules';
import { useCourses } from '@/hooks/useCourses';
import { useLocalization } from '@/hooks/useLocalization';
import { useSections } from '@/hooks/useSections';
import { useSubjects } from '@/hooks/useSubjects';

import { IClassSchedule } from '@/types/classSchedule';
import { useFaculties } from '@/hooks/useFaculties';

export default function ClassScheduleListView() {
  const { t } = useLocalization();
  const translate = useTranslations();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const { classSchedules, listStatus, pagination, loadClassSchedules, removeClassSchedule } =
    useClassSchedules();
  const { courses, loadCourses } = useCourses()
  const { subjects, loadSubjects } = useSubjects()
  const { batches, loadBatches } = useBatches()
  const { sections, loadSections } = useSections()
  const { faculties, loadFaculties } = useFaculties();

  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const courseId = searchParams.get('courseId');
  const batchId = searchParams.get('batchId');
  const sectionId = searchParams.get('sectionId');

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
    loadClassSchedules({ page, limit: limitNum, ...params });
  };

  useEffect(() => {
    loadWithParams(searchParams, skip, limit);
  }, [searchParams, skip, limit, loadClassSchedules]);

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

  useEffect(()=>{
    loadFaculties({ page: 1, limit: 99 })
  },[loadFaculties])

  const handleEditDrawer = (id: number) => {
    setSelectedId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };
  const handleCreateDrawer = () => {
    setSelectedId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };
  const handleDrawerSuccess = () => {
    loadClassSchedules({ page: 1, limit: 10 });
  };
  const handleViewDetails = (id: number) => {
    setSelectedDetailsId(id);
    setDetailsDrawerVisible(true);
  };
  const handleDetailsEdit = (id: number) => {
    setDetailsDrawerVisible(false);
    setSelectedId(id);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const config: EntityConfig<IClassSchedule> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/class-schedules',
    searchFields: ['status'] as (keyof IClassSchedule)[],
    onSearch: (searchText: string) => {
      const params = Object.fromEntries(searchParams.entries());
      delete params.skip;
      delete params.limit;
      loadClassSchedules({ page: 1, limit: parseInt(limit ?? '10'), ...params, search: searchText });
    },
    onQuickAdd: handleCreateDrawer,
    items: classSchedules,
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
        key: 'subjectId',
        label: t(LOCALE_KEYS.SUBJECT),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...subjects.map((s) => ({ label: s.name, value: String(s.id) })),
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
        key: 'sectionId',
        label: t(LOCALE_KEYS.SECTION),
        options: [
          { label: t(LOCALE_KEYS.ALL, { defaultValue: 'All' }), value: '' },
          ...sections.map((s) => ({ label: s.name, value: String(s.id) })),
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
        title: t(LOCALE_KEYS.SUBJECT),
        dataIndex: 'subject.name',
        key: 'subject',
        render: (_, record) => <span>{record.subject?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.BATCH),
        dataIndex: 'batch.name',
        key: 'batch',
        render: (_, record) => <span>{record.batch?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.WEEK_DAY),
        dataIndex: 'weekDay.name',
        key: 'weekDay',
        render: (_, record) => <span>{record.weekDay?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.TIME_SLOT),
        dataIndex: 'timeSlot.name',
        key: 'timeSlot',
        render: (_, record) => <span>{record.timeSlot?.name || 'N/A'}</span>,
      },
      {
        title: t(LOCALE_KEYS.ROOM),
        dataIndex: 'room.name',
        key: 'room',
        render: (_, record) => <span>{record.room?.name || 'N/A'}</span>,
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
        render: (item: IClassSchedule) => (
          <EntityActions
            onView={() => router.push(`/class-schedules/${item.id}`)}
            onViewModal={handleViewDetails}
            viewModalText={t(LOCALE_KEYS.QUICK_VIEW)}
            onEdit={() => router.push(`/class-schedules/${item.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText={t(LOCALE_KEYS.QUICK_EDIT)}
            onDelete={() => removeClassSchedule(item.id)}
            id={item.id}
          />
        ),
      },
    ],
  };

  return (
    <>
      <AsyncErrorBoundary
        error={
          listStatus.status === Status.FAILED
            ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
            : null
        }
        onRetry={() => loadClassSchedules({ page: 1, limit: 10 })}
      >
        <EntityList config={config as EntityConfig<IClassSchedule>} />
      </AsyncErrorBoundary>

      <ClassScheduleFormDrawer
        mode={drawerMode}
        classScheduleId={selectedId}
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        onSuccess={handleDrawerSuccess}
      />

      <ClassScheduleDetailsDrawer
        classScheduleId={selectedDetailsId}
        visible={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={handleDetailsEdit}
      />
    </>
  );
}
