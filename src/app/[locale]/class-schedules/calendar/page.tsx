'use client';

import { CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Tabs, Card } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ClassScheduleCalendar from '@/components/classSchedules/ClassScheduleCalendar';
import ClassScheduleDetailsDrawer from '@/components/classSchedules/ClassScheduleDetailsDrawer';
import ClassScheduleFormDrawer from '@/components/classSchedules/ClassScheduleFormDrawer';
import AsyncErrorBoundary from '@/components/error/AsyncErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityActions from '@/components/ui/EntityActions';
import { EntityConfig, EntityList } from '@/components/ui/EntityList';
import { PageHeader } from '@/components/ui/PageHeader';
import StatusTag from '@/components/ui/StatusTag';

import { useClassSchedules } from '@/hooks/useClassSchedules';
import { useLocalization } from '@/hooks/useLocalization';

import { IClassSchedule } from '@/types/classSchedule';
import { Status } from '@/types/common';



export default function ClassScheduleCalendarPage() {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' });
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('calendar');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const { classSchedules, listStatus, pagination, loadClassSchedules, removeClassSchedule } =
    useClassSchedules();

  useEffect(() => {
    // Load schedules for current month by default
    const currentDate = dayjs();
    
    loadClassSchedules({ 
      page: 1, 
      limit: 100,
      year: currentDate.year(),
      month: currentDate.month() + 1 // API expects 1-12, dayjs uses 0-11
    });
  }, [loadClassSchedules]);

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
    // Reload schedules for current period after creating/updating
    loadClassSchedules({ 
      page: 1, 
      limit: 100,
      year: dayjs().year(),
      month: dayjs().month() + 1 // API expects 1-12, dayjs uses 0-11
    });
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

  const handleScheduleClick = (schedule: IClassSchedule) => {
    setSelectedDetailsId(schedule.id);
    setDetailsDrawerVisible(true);
  };

  const handleDateSelect = (date: any) => {
    // You can implement date-specific actions here
    console.log('Selected date:', date.format('YYYY-MM-DD'));
  };

  const handlePeriodChange = (year: number, month: number) => {
    // Call API to fetch schedules for the specific year/month
    loadClassSchedules({ 
      page: 1, 
      limit: 100,
      year: year,
      month: month + 1 // API expects 1-12, dayjs uses 0-11
    });
  };

  const config: EntityConfig<IClassSchedule> = {
    name: entityName,
    title: t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName }),
    route: '/class-schedules',
    searchFields: ['status'] as (keyof IClassSchedule)[],
    onSearch: (searchText: string) => {
      // Search within current period
      loadClassSchedules({ 
        page: 1, 
        limit: 100, 
        search: searchText,
        year: dayjs().year(),
        month: dayjs().month() + 1 // API expects 1-12, dayjs uses 0-11
      });
    },
    onQuickAdd: handleCreateDrawer,
    items: classSchedules,
    itemsCount: pagination?.total ?? 0,
    loading: listStatus.status === Status.LOADING,
    error: listStatus.status === Status.FAILED ? listStatus.message : null,
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
        title: t(LOCALE_KEYS.START_DATE),
        dataIndex: 'startDate',
        key: 'startDate',
        render: (text: string) => new Date(text).toLocaleDateString(),
      },
      {
        title: t(LOCALE_KEYS.END_DATE),
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text: string) => new Date(text).toLocaleDateString(),
      },
      {
        title: t(LOCALE_KEYS.STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => <StatusTag status={text} />,
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
    <ProtectedRoute>
      <MainLayout>
        <PageHeader 
          title={t(LOCALE_KEYS.MANAGEMENT_NAME, { name: entityName })} 
          onBack={() => router.back()}
        />
        
        <AsyncErrorBoundary
          error={
            listStatus.status === Status.FAILED
              ? new Error(listStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName }))
              : null
          }
          onRetry={() => {
            loadClassSchedules({ 
              page: 1, 
              limit: 100,
              year: dayjs().year(),
              month: dayjs().month() + 1 // API expects 1-12, dayjs uses 0-11
            });
          }}
        >
          <Card>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={[
                {
                  key: 'calendar',
                  label: (
                    <span>
                      <CalendarOutlined />
                      {t(LOCALE_KEYS.CALENDAR_VIEW, { defaultValue: 'Calendar View' })}
                    </span>
                  ),
                                     children: (
                     <ClassScheduleCalendar
                       classSchedules={classSchedules}
                       loading={listStatus.status === Status.LOADING}
                       onDateSelect={handleDateSelect}
                       onScheduleClick={handleScheduleClick}
                       onPeriodChange={handlePeriodChange}
                     />
                   ),
                },
                {
                  key: 'list',
                  label: (
                    <span>
                      <UnorderedListOutlined />
                      {t(LOCALE_KEYS.LIST_VIEW, { defaultValue: 'List View' })}
                    </span>
                  ),
                  children: <EntityList config={config as EntityConfig<IClassSchedule>} />,
                },
              ]}
            />
          </Card>
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
      </MainLayout>
    </ProtectedRoute>
  );
}
