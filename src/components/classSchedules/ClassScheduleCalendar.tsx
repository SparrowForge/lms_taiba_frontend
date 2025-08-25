'use client';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Calendar, Card, Tag, Tooltip, Button, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState, useMemo } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';


import { IClassSchedule } from '@/types/classSchedule';

interface ClassScheduleCalendarProps {
  classSchedules: IClassSchedule[];
  loading?: boolean;
  onDateSelect?: (date: Dayjs) => void;
  onScheduleClick?: (schedule: IClassSchedule) => void;
  onPeriodChange?: (year: number, month: number) => void;
}

const ClassScheduleCalendar: React.FC<ClassScheduleCalendarProps> = ({
  classSchedules,
  loading = false,
  onDateSelect,
  onScheduleClick,
  onPeriodChange,
}) => {
  const { t } = useLocalization();
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month());

  // Get unique batches and faculties for filtering
  const batches = useMemo(() => {
    const uniqueBatches = Array.from(
      new Set(classSchedules.map(schedule => schedule.batch?.name).filter(Boolean))
    );
    return uniqueBatches;
  }, [classSchedules]);

  const faculties = useMemo(() => {
    const uniqueFaculties = Array.from(
      new Set(classSchedules.map(schedule => schedule.faculty?.fullName).filter(Boolean))
    );
    return uniqueFaculties;
  }, [classSchedules]);

  // Filter schedules based on selected batch and faculty
  const filteredSchedules = useMemo(() => {
    return classSchedules.filter(schedule => {
      const batchMatch = selectedBatch === 'all' || schedule.batch?.name === selectedBatch;
      const facultyMatch = selectedFaculty === 'all' || schedule.faculty?.fullName === selectedFaculty;
      return batchMatch && facultyMatch;
    });
  }, [classSchedules, selectedBatch, selectedFaculty]);

  // Group schedules by date
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, IClassSchedule[]> = {};

    filteredSchedules.forEach(schedule => {
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);

      // Handle recurring schedules
      if (schedule.isRecurring) {
        let currentDate = startDate.startOf('month').startOf('week');
        const monthEnd = endDate.endOf('month').endOf('week');

        while (currentDate.isBefore(monthEnd)) {
          if (currentDate.isSame(startDate, 'month')) {
            const weekDay = currentDate.day();
            const scheduleWeekDay = schedule.weekDay?.dayNumber || 1;

            // Adjust for dayjs day numbering (0 = Sunday, 1 = Monday, etc.)
            const adjustedWeekDay = weekDay === 0 ? 7 : weekDay;

            if (adjustedWeekDay === scheduleWeekDay) {
              const dateKey = currentDate.format('YYYY-MM-DD');
              if (!grouped[dateKey]) {
                grouped[dateKey] = [];
              }
              grouped[dateKey].push(schedule);
            }
          }
          currentDate = currentDate.add(1, 'day');
        }
      } else {
        // Non-recurring schedules
        const dateKey = startDate.format('YYYY-MM-DD');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(schedule);
      }
    });

    return grouped;
  }, [filteredSchedules]);

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
              onClick={() => onScheduleClick?.(schedule)}
            >
              {schedule.subject?.name?.substring(0, 8)}...
            </Tag>
          </Tooltip>
        ))}
        {daySchedules.length > 3 && (
          <Tag color="default">
            +{daySchedules.length - 3} more
          </Tag>
        )}
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
    setCurrentMonth(date);
    setSelectedYear(date.year());
    setSelectedMonth(date.month());
  };

  // Handle date select
  const handleDateSelect = (date: Dayjs) => {
    onDateSelect?.(date);
  };

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const newDate = currentMonth.year(year);
    setCurrentMonth(newDate);
    // Call API to fetch schedules for the new year
    onPeriodChange?.(year, selectedMonth);
  };

  // Handle month change from filter
  const handleMonthFilterChange = (month: number) => {
    setSelectedMonth(month);
    const newDate = currentMonth.month(month);
    setCurrentMonth(newDate);
    // Call API to fetch schedules for the new month
    onPeriodChange?.(selectedYear, month);
  };

  // Custom header renderer with navigation
  const headerRender = ({ value, onChange }: any) => {
    const month = value.month();
    const year = value.year();

    const goMonth = (direction: 'prev' | 'next') => {
      const newValue = value.clone();
      if (direction === 'prev') {
        newValue.month(month - 1);
      } else {
        newValue.month(month + 1);
      }
      onChange(newValue);
      setCurrentMonth(newValue);
    };

    return (
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => goMonth('prev')}
        />
        <div className="text-lg font-semibold">
          {value.format('MMMM YYYY')}
        </div>
        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={() => goMonth('next')}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card size="small">
        <Space wrap>
          <div>
            <span className="mr-2">{t(LOCALE_KEYS.YEAR)}:</span>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              style={{ width: 100 }}
              options={Array.from({ length: 10 }, (_, i) => {
                const year = dayjs().year() - 5 + i;
                return { label: year.toString(), value: year };
              })}
            />
          </div>
          <div>
            <span className="mr-2">{t(LOCALE_KEYS.MONTH)}:</span>
            <Select
              value={selectedMonth}
              onChange={handleMonthFilterChange}
              style={{ width: 120 }}
              options={[
                { label: t(LOCALE_KEYS.JANUARY), value: 0 },
                { label: t(LOCALE_KEYS.FEBRUARY), value: 1 },
                { label: t(LOCALE_KEYS.MARCH), value: 2 },
                { label: t(LOCALE_KEYS.APRIL), value: 3 },
                { label: t(LOCALE_KEYS.MAY), value: 4 },
                { label: t(LOCALE_KEYS.JUNE), value: 5 },
                { label: t(LOCALE_KEYS.JULY), value: 6 },
                { label: t(LOCALE_KEYS.AUGUST), value: 7 },
                { label: t(LOCALE_KEYS.SEPTEMBER), value: 8 },
                { label: t(LOCALE_KEYS.OCTOBER), value: 9 },
                { label: t(LOCALE_KEYS.NOVEMBER), value: 10 },
                { label: t(LOCALE_KEYS.DECEMBER), value: 11 }
              ]}
            />
          </div>
          <div>
            <span className="mr-2">{t(LOCALE_KEYS.BATCH)}:</span>
            <Select
              value={selectedBatch}
              onChange={setSelectedBatch}
              style={{ width: 150 }}
              options={[
                { label: t(LOCALE_KEYS.ALL), value: 'all' },
                ...batches.map(batch => ({ label: batch, value: batch }))
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
                ...faculties.map(faculty => ({ label: faculty, value: faculty }))
              ]}
            />
          </div>
        </Space>
      </Card>

      {/* Calendar */}
      <Card>
        <Calendar
          value={currentMonth}
          onChange={handleMonthChange}
          dateCellRender={dateCellRender}
          headerRender={headerRender}
          onSelect={handleDateSelect}
          fullscreen={true}
        />
      </Card>

      {/* Legend */}
      <Card size="small">
        <div className="text-sm text-gray-600">
          <div className="font-semibold mb-2">{t(LOCALE_KEYS.LEGEND)}:</div>
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
    </div>
  );
};

export default ClassScheduleCalendar;
