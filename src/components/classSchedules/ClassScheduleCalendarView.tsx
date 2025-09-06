'use client';

import {Button, Calendar, Card, Select, Space, Tag, Tooltip} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useMemo, useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useClassSchedules} from '@/hooks/useClassSchedules';
import {useLocalization} from '@/hooks/useLocalization';

import {IClassSchedule} from '@/types/classSchedule';
import {Status} from '@/types/common';

import ClassScheduleDetailsDrawer from './ClassScheduleDetailsDrawer';
import ClassScheduleFormDrawer from './ClassScheduleFormDrawer';

function ClassScheduleCalendarView() {
  const { t } = useLocalization();
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month());
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
      month: currentDate.month() + 1, // API expects 1-12, dayjs uses 0-11
    });
  }, [loadClassSchedules]);

  const handlePeriodChange = (year: number, month: number) => {
    // Call API to fetch schedules for the specific year/month
    loadClassSchedules({
      page: 1,
      limit: 100,
      year: year,
      month: month + 1, // API expects 1-12, dayjs uses 0-11
    });
  };

  const handleDateSelect = (date: any) => {
    // You can implement date-specific actions here
    console.log('Selected date:', date.format('YYYY-MM-DD'));
    setCurrentMonth(date);
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

  // Get unique batches and faculties for filtering
  const batches = useMemo(() => {
    const uniqueBatches = Array.from(
      new Set(classSchedules.map((schedule) => schedule.batch?.name).filter(Boolean)),
    );
    return uniqueBatches;
  }, [classSchedules]);

  const faculties = useMemo(() => {
    const uniqueFaculties = Array.from(
      new Set(classSchedules.map((schedule) => schedule.faculty?.fullName).filter(Boolean)),
    );
    return uniqueFaculties;
  }, [classSchedules]);

  // Filter schedules based on selected batch and faculty
  const filteredSchedules = useMemo(() => {
    return classSchedules.filter((schedule) => {
      const batchMatch = selectedBatch === 'all' || schedule.batch?.name === selectedBatch;
      const facultyMatch =
        selectedFaculty === 'all' || schedule.faculty?.fullName === selectedFaculty;
      return batchMatch && facultyMatch;
    });
  }, [classSchedules, selectedBatch, selectedFaculty]);

  // Group schedules by date
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, IClassSchedule[]> = {};

    filteredSchedules.forEach((schedule) => {
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);

      // Handle recurring schedules
      if (schedule.isRecurring && schedule.weekDay?.dayNumber) {
        // Get the current month's start and end
        const monthStart = currentMonth.startOf('month');
        const monthEnd = currentMonth.endOf('month');

        // Find the first occurrence of this weekday in the current month
        let currentDate = monthStart;
        while (currentDate.day() !== schedule.weekDay.dayNumber % 7) {
          currentDate = currentDate.add(1, 'day');
        }

        // Add all occurrences of this weekday in the current month
        while (currentDate.isSame(monthStart, 'month')) {
          // Check if this date falls within the schedule's date range
          if (
            (currentDate.isSame(startDate) || currentDate.isAfter(startDate)) &&
            (currentDate.isSame(endDate) || currentDate.isBefore(endDate))
          ) {
            const dateKey = currentDate.format('YYYY-MM-DD');
            if (!grouped[dateKey]) {
              grouped[dateKey] = [];
            }
            grouped[dateKey].push(schedule);
          }
          currentDate = currentDate.add(7, 'day');
        }
      } else {
        // Non-recurring schedules - check if they fall in the current month
        if (startDate.isSame(currentMonth, 'month')) {
          const dateKey = startDate.format('YYYY-MM-DD');
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(schedule);
        }
      }
    });

    return grouped;
  }, [filteredSchedules, currentMonth]);

  // Custom date cell renderer
  const dateCellRender = (date: Dayjs) => {
    const dateKey = date.format('YYYY-MM-DD');
    const daySchedules = schedulesByDate[dateKey] || [];

    if (daySchedules.length === 0) {
      return null;
    }

    return (
      <div className="calendar-cell-content">
        {daySchedules.slice(0, 3).map((schedule, index) => (
          <Tooltip
            key={`${schedule.id}-${index}`}
            title={`${schedule.subject?.name} - ${schedule.timeSlot?.name} - ${schedule.room?.name}`}
          >
            <Tag
              color={getScheduleColor(schedule)}
              className="cursor-pointer hover:opacity-80"
              onClick={() => handleScheduleClick(schedule)}
            >
              {schedule.subject?.name?.substring(0, 8)}...
            </Tag>
          </Tooltip>
        ))}
        {daySchedules.length > 3 && <Tag color="default">+{daySchedules.length - 3} more</Tag>}
      </div>
    );
  };

  // Get color for schedule based on status or type
  const getScheduleColor = (schedule: IClassSchedule): string => {
    if (schedule.status === 'ACTIVE') {
      return 'green';
    } else if (schedule.status === 'INACTIVE') {
      return 'red';
    } else if (schedule.status === 'PENDING') {
      return 'orange';
    }

    // Default colors based on class type
    switch (schedule.classScheduleType) {
      case 'REGULAR':
        return 'blue';
      case 'LAB':
        return 'purple';
      case 'TUTORIAL':
        return 'cyan';
      case 'EXAM':
        return 'red';
      default:
        return 'default';
    }
  };

  // Handle month change
  const handleMonthChange = (date: Dayjs) => {
    console.log('handleMonthChange', date);
    setCurrentMonth(date);
    setSelectedYear(date.year());
    setSelectedMonth(date.month());
    // Call API to fetch schedules for the new month
    handlePeriodChange(date.year(), date.month());
  };

  const handlePanelChange = (date: Dayjs, mode: 'month' | 'year') => {
    console.log('handlePanelChange', date, mode);
  };

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const newDate = currentMonth.year(year);
    setCurrentMonth(newDate);
    // Call API to fetch schedules for the new year
    handlePeriodChange(year, selectedMonth);
  };

  // Handle month change from filter
  const handleMonthFilterChange = (month: number) => {
    setSelectedMonth(month);
    const newDate = currentMonth.month(month);
    setCurrentMonth(newDate);
    // Call API to fetch schedules for the new month
    handlePeriodChange(selectedYear, month);
  };

  return (
    <div
      className="flex flex-col gap-[12px] overflow-y-auto"
      style={{ height: 'calc(100vh - 142px)' }}
    >
      {/* Filters and Actions */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space wrap>
            <div>
              <span className="mr-2">{t(LOCALE_KEYS.BATCH)}:</span>
              <Select
                value={selectedBatch}
                onChange={setSelectedBatch}
                style={{ width: 150 }}
                options={[
                  { label: t(LOCALE_KEYS.ALL), value: 'all' },
                  ...batches.map((batch) => ({ label: batch, value: batch })),
                ]}
              />
            </div>
            <div>
              <span className="mr-2">{t(LOCALE_KEYS.FACULTY)}:</span>
              <Select
                value={selectedFaculty}
                onChange={setSelectedFaculty}
                style={{ width: 150 }}
                options={[
                  { label: t(LOCALE_KEYS.ALL), value: 'all' },
                  ...faculties.map((faculty) => ({ label: faculty, value: faculty })),
                ]}
              />
            </div>
          </Space>

          <Button
            type="primary"
            onClick={() => {
              setDrawerMode('create');
              setSelectedId(undefined);
              setDrawerVisible(true);
            }}
          >
            {t(LOCALE_KEYS.CREATE_NAME, { name: t(LOCALE_KEYS.CLASS_SCHEDULE) })}
          </Button>
        </div>
      </Card>

      {/* Calendar */}
      <Card>
        {listStatus.status === Status.LOADING ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">{t(LOCALE_KEYS.LOADING)}...</div>
          </div>
        ) : listStatus.status === Status.FAILED ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-red-500">
              {t(LOCALE_KEYS.ERROR)}: {listStatus.message}
            </div>
          </div>
        ) : (
          <>
            {/* Month Navigation */}
            <div className="flex items-center justify-between p-4 border-b">
              <Button
                type="text"
                onClick={() => {
                  const prevMonth = currentMonth.subtract(1, 'month');
                  handleMonthChange(prevMonth);
                }}
              >
                ← {currentMonth.subtract(1, 'month').format('MMMM')}
              </Button>
              <div className="text-lg font-semibold">{currentMonth.format('MMMM YYYY')}</div>
              <Button
                type="text"
                onClick={() => {
                  const nextMonth = currentMonth.add(1, 'month');
                  handleMonthChange(nextMonth);
                }}
              >
                {currentMonth.add(1, 'month').format('MMMM')} →
              </Button>
            </div>

            {filteredSchedules.length === 0 ? (
              <div className="text-center p-8">
                <div className="text-gray-500 text-lg mb-2">No class schedules found</div>
                <div className="text-gray-400 text-sm">
                  Try changing your filters or create a new schedule
                </div>
              </div>
            ) : (
              <Calendar
                value={currentMonth}
                cellRender={dateCellRender}
                onSelect={handleDateSelect}
                onChange={handleMonthChange}
                mode="month"
                fullscreen={true}
                showWeek={true}
                validRange={[dayjs('2024-01-01'), dayjs('2030-12-31')]}
              />
            )}
          </>
        )}
      </Card>

      {/* Legend */}
      <Card size="small">
        <div className="text-sm text-gray-600">
          <div className="font-semibold">{t(LOCALE_KEYS.LEGEND)}:</div>
          <Space wrap>
            <Tag color="green">{t(LOCALE_KEYS.ACTIVE)}</Tag>
            <Tag color="red">{t(LOCALE_KEYS.INACTIVE)}</Tag>
            <Tag color="orange">{t(LOCALE_KEYS.PENDING)}</Tag>
            <Tag color="blue">{t(LOCALE_KEYS.REGULAR)}</Tag>
            <Tag color="purple">{t(LOCALE_KEYS.LAB)}</Tag>
            <Tag color="cyan">{t(LOCALE_KEYS.TUTORIAL)}</Tag>
          </Space>
        </div>
      </Card>

      {/* Drawers */}
      <ClassScheduleDetailsDrawer
        visible={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={handleDetailsEdit}
        classScheduleId={selectedDetailsId}
      />

      <ClassScheduleFormDrawer
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        onSuccess={() => {
          setDrawerVisible(false);
          // Refresh the current month's data
          handlePeriodChange(selectedYear, selectedMonth);
        }}
        mode={drawerMode}
        classScheduleId={selectedId}
      />
    </div>
  );
}

export default ClassScheduleCalendarView;
