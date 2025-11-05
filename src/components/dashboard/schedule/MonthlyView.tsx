'use client';

import {Calendar, Tag, Tooltip} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React, {useMemo, useState} from 'react';

import {IClassSchedule} from '@/types/classSchedule';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface MonthlyViewProps {
  monthSchedules: IClassSchedule[];
  onScheduleClick?: (schedule: IClassSchedule, date?: string) => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ monthSchedules, onScheduleClick }) => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  // Group schedules by date
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, IClassSchedule[]> = {};

    monthSchedules.forEach((schedule) => {
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);

      // For recurring schedules, generate all dates
      if (schedule.isRecurring && schedule.weekDay?.dayNumber !== undefined) {
        const monthStart = selectedMonth.startOf('month');
        const monthEnd = selectedMonth.endOf('month');

        let currentDate = monthStart;

        // Find first occurrence of the weekday in the month
        while (currentDate.day() !== schedule.weekDay.dayNumber % 7) {
          currentDate = currentDate.add(1, 'day');
        }

        // Add all occurrences within the schedule range and current month
        while (currentDate.isSameOrBefore(monthEnd)) {
          if (
            currentDate.isSameOrAfter(startDate, 'day') &&
            currentDate.isSameOrBefore(endDate, 'day')
          ) {
            const dateKey = currentDate.format('YYYY-MM-DD');
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(schedule);
          }
          currentDate = currentDate.add(7, 'day');
        }
      } else {
        // For one-time schedules
        const dateKey = startDate.format('YYYY-MM-DD');
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(schedule);
      }
    });

    return grouped;
  }, [monthSchedules, selectedMonth]);

  const getScheduleColor = (index: number): string => {
    const colors = ['blue', 'green', 'purple', 'cyan', 'orange', 'magenta', 'red', 'volcano'];
    return colors[index % colors.length];
  };

  const dateCellRender = (date: Dayjs) => {
    const dateKey = date.format('YYYY-MM-DD');
    const daySchedules = schedulesByDate[dateKey] || [];
    const isWeekend = date.day() === 5 || date.day() === 6; // Friday & Saturday

    if (daySchedules.length === 0) {
      return isWeekend ? (
        <div className="h-full flex items-center justify-center opacity-50">
          <span className="text-xs text-red-500">Weekend</span>
        </div>
      ) : null;
    }

    return (
      <div className="h-full overflow-hidden">
        {daySchedules.slice(0, 3).map((schedule, index) => (
          <Tooltip
            key={`${schedule.id}-${dateKey}-${index}`}
            title={
              <div>
                <div className="font-semibold">{schedule.subject?.name}</div>
                <div>{schedule.timeSlot?.name}</div>
                <div>{schedule.room?.name}</div>
                {schedule.faculty && <div>Faculty: {schedule.faculty.fullName}</div>}
              </div>
            }
          >
            <Tag
              color={getScheduleColor(index)}
              className="mb-1 cursor-pointer hover:opacity-80 text-xs truncate block"
              style={{ maxWidth: '100%' }}
              onClick={() => onScheduleClick?.(schedule, dateKey)}
            >
              {schedule.subject?.name?.substring(0, 12) || 'No Subject'}
            </Tag>
          </Tooltip>
        ))}
        {daySchedules.length > 3 && (
          <Tag color="default" className="text-xs">
            +{daySchedules.length - 3} more
          </Tag>
        )}
      </div>
    );
  };

  const handleMonthChange = (date: Dayjs) => {
    setSelectedMonth(date);
  };

  return (
    <div className="mt-4">
      <Calendar
        value={selectedMonth}
        cellRender={dateCellRender}
        onChange={handleMonthChange}
        mode="month"
        fullscreen
      />
    </div>
  );
};

export default MonthlyView;
