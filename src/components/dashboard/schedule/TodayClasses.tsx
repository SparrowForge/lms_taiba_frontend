'use client';

import {ClockCircleOutlined, EnvironmentOutlined, TeamOutlined} from '@ant-design/icons';
import {Card, Empty} from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

import {IClassSchedule} from '@/types/classSchedule';

interface TodayClassesProps {
  todaySchedules: IClassSchedule[];
  onScheduleClick?: (schedule: IClassSchedule, date?: string) => void;
}

const TodayClasses: React.FC<TodayClassesProps> = ({ todaySchedules, onScheduleClick }) => {
  const { t } = useLocalization();

  // Sort by time
  const sortedSchedules = [...todaySchedules].sort((a, b) => {
    const timeA = a.timeSlot?.startTime || '00:00';
    const timeB = b.timeSlot?.startTime || '00:00';
    return timeA.localeCompare(timeB);
  });

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = dayjs(`2000-01-01 ${startTime}`);
    const end = dayjs(`2000-01-01 ${endTime}`);
    return end.diff(start, 'minute');
  };

  const formatTime = (time: string): string => {
    return dayjs(`2000-01-01 ${time}`).format('h:mm A');
  };

  return (
    <div className="mt-8">
      <h4 className="font-semibold text-base mb-4">
        {t(LOCALE_KEYS.TODAY_CLASSES_TITLE, { defaultValue: "Today's Classes" })} | دروس اليوم
      </h4>

      {sortedSchedules.length === 0 ? (
        <Empty description="No classes scheduled for today" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedSchedules.map((schedule) => {
            const duration = calculateDuration(
              schedule.timeSlot?.startTime || '00:00',
              schedule.timeSlot?.endTime || '00:00',
            );
            const todayDate = dayjs().format('YYYY-MM-DD');

            return (
              <Card
                key={schedule.id}
                className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                bodyStyle={{ padding: '16px' }}
                onClick={() => onScheduleClick?.(schedule, todayDate)}
              >
                {/* Time and Duration */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-blue-500" />
                    <span className="font-semibold text-blue-600">
                      {formatTime(schedule.timeSlot?.startTime || '00:00')}
                    </span>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{duration} min</span>
                </div>

                {/* Subject Name */}
                <h5 className="font-semibold text-base mb-2 truncate">
                  {schedule.subject?.name || 'No Subject'}
                </h5>

                {/* Room and Capacity */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined />
                    <span>{schedule.room?.name || 'No Room'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TeamOutlined />
                    <span>{schedule.maxCapacity || 0} students</span>
                  </div>
                </div>

                {/* Faculty (if available) */}
                {schedule.faculty && (
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    Instructor: {schedule.faculty.fullName}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodayClasses;
