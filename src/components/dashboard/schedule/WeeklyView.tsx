'use client';

import dayjs from 'dayjs';
import React, {useMemo} from 'react';

import {useLocalization} from '@/hooks/useLocalization';

import {IClassSchedule} from '@/types/classSchedule';
import { useLocale } from 'next-intl';

interface WeeklyViewProps {
  weekSchedules: IClassSchedule[];
  onScheduleClick?: (schedule: IClassSchedule, date?: string) => void;
}

const WEEKDAYS = [
  { key: 'Sunday', localeKey: 'SUN', arName: 'الأحد' },
  { key: 'Monday', localeKey: 'MON', arName: 'الاثنين' },
  { key: 'Tuesday', localeKey: 'TUE', arName: 'الثلاثاء' },
  { key: 'Wednesday', localeKey: 'WED', arName: 'الأربعاء' },
  { key: 'Thursday', localeKey: 'THU', arName: 'الخميس' },
];

const WeeklyView: React.FC<WeeklyViewProps> = ({ weekSchedules, onScheduleClick }) => {
  const locale = useLocale();

  // Group schedules by weekday
  const schedulesByDay = useMemo(() => {
    const grouped: Record<string, IClassSchedule[]> = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
    };

    weekSchedules.forEach((schedule) => {
      const weekDayName = schedule.weekDay?.name;
      if (weekDayName && grouped[weekDayName]) {
        grouped[weekDayName].push(schedule);
      }
    });

    // Sort schedules by time slot for each day
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => {
        const timeA = a.timeSlot?.startTime || '00:00';
        const timeB = b.timeSlot?.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });
    });

    return grouped;
  }, [weekSchedules]);

  const getScheduleColor = (index: number): string => {
    const colors = ['blue', 'green', 'purple', 'cyan', 'orange', 'magenta'];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {WEEKDAYS.map((day, dayIndex) => {
        const daySchedules = schedulesByDay[day.key] || [];
        const isWeekend = dayIndex >= 5;

        return (
          <div key={day.key} className="flex flex-col">
            {/* Day Header */}
            <div className="text-center font-medium mb-3 bg-gray-50 p-3 rounded-lg">
              {locale === 'en' ? <div className="text-sm">{day.key}</div> :<div className="text-xs text-gray-500">{day.arName}</div>}
              
              
            </div>

            {/* Classes */}
            <div className="flex flex-col gap-2">
              {daySchedules.length > 0 ? (
                daySchedules.map((schedule, idx) => {
                  // Calculate the actual date for this day of the week
                  const today = dayjs();
                  const targetDay = WEEKDAYS.findIndex((wd) => wd.key === day.key);
                  const currentDay = today.day();
                  const daysToAdd = targetDay - currentDay;
                  const scheduleDate = today.add(daysToAdd, 'day').format('YYYY-MM-DD');

                  return (
                    <div
                      key={schedule.id}
                      className={`rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4`}
                      style={{
                        backgroundColor: `var(--ant-${getScheduleColor(idx)}-1)`,
                        borderLeftColor: `var(--ant-${getScheduleColor(idx)}-6)`,
                      }}
                      onClick={() => onScheduleClick?.(schedule, scheduleDate)}
                    >
                      <div className="font-semibold text-sm mb-1">
                        {schedule.subject?.name || 'No Subject'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {schedule.timeSlot?.startTime} - {schedule.timeSlot?.endTime}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400 text-xs p-4 bg-gray-50 rounded-lg">
                  {isWeekend ? (
                    <div>
                      <div className="font-medium">No Classes</div>
                      <div className="text-xs mt-1">Weekend</div>
                    </div>
                  ) : (
                    'No Classes'
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyView;
