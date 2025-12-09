'use client';

import { Calendar, Card, Tag, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

import { ClassScheduleStatus } from '@/enums';
import { useAuth } from '@/hooks/useAuth';
import { useClassSchedules } from '@/hooks/useClassSchedules';
import { useExams } from '@/hooks/useExams';

import { IClassSchedule } from '@/types/classSchedule';

import ClassScheduleDetailsDrawer from './ClassScheduleDetailsDrawer';
import ClassScheduleFormDrawer from './ClassScheduleFormDrawer';

function ClassScheduleCalendarView() {
  const { user } = useAuth();

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>();
  const [formDrawerVisible, setFormDrawerVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const { classSchedules, loadClassSchedules } = useClassSchedules();
  const { exams, loadExams } = useExams();

  /* Load class schedules */
  useEffect(() => {
    loadClassSchedules({
      page: 1,
      limit: 100,
      year: currentMonth.year(),
      month: currentMonth.month() + 1,
    });
  }, [loadClassSchedules, currentMonth]);

  /* Load exams */
  useEffect(() => {
    if (!user?.student?.batchId) return;
    loadExams({
      page: 1,
      limit: 100,
      batchId: user.student.batchId,
    });
  }, [loadExams, user?.student?.batchId]);

  /* ✅ Keep your original recurring class logic */
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, IClassSchedule[]> = {};

    classSchedules.forEach((schedule) => {
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);

      if (schedule.isRecurring && schedule.weekDay?.dayNumber !== undefined) {
        const monthStart = currentMonth.startOf('month');
        let currentDate = monthStart;

        while (currentDate.day() !== schedule.weekDay.dayNumber % 7) {
          currentDate = currentDate.add(1, 'day');
        }

        while (currentDate.isSame(monthStart, 'month')) {
          if (
            currentDate.isSame(startDate, 'day') ||
            (currentDate.isAfter(startDate) &&
              (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')))
          ) {
            const key = currentDate.format('YYYY-MM-DD');
            grouped[key] ??= [];
            grouped[key].push(schedule);
          }
          currentDate = currentDate.add(7, 'day');
        }
      } else {
        if (startDate.isSame(currentMonth, 'month')) {
          const key = startDate.format('YYYY-MM-DD');
          grouped[key] ??= [];
          grouped[key].push(schedule);
        }
      }
    });

    return grouped;
  }, [classSchedules, currentMonth]);

  /* ✅ Exams grouped by examDatetime */
  const examsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    exams.forEach((exam: any) => {
      const key = dayjs(exam.examDatetime).format('YYYY-MM-DD');
      grouped[key] ??= [];
      grouped[key].push(exam);
    });

    return grouped;
  }, [exams]);

  /* Colors */
  const getClassColor = (schedule: IClassSchedule) => {
    switch (schedule.status) {
      case ClassScheduleStatus.ACTIVE:
        return 'green';
      case ClassScheduleStatus.INACTIVE:
        return 'red';
      case ClassScheduleStatus.CANCELLED:
        return 'orange';
      default:
        return 'default';
    }
  };

  /* Cell render */
  const dateCellRender = (date: Dayjs) => {
    const key = date.format('YYYY-MM-DD');
    const dayClasses = schedulesByDate[key] || [];
    const dayExams = examsByDate[key] || [];

    if (!dayClasses.length && !dayExams.length) return null;

    return (
      <div className="flex flex-col gap-1">
        {dayClasses.slice(0, 2).map((schedule) => (
          <Tooltip
            key={`class-${schedule.id}`}
            title={`${schedule.subject?.name} • ${schedule.timeSlot?.name}`}
          >
            <Tag
              color={getClassColor(schedule)}
              className="cursor-pointer"
              onClick={() => {
                setSelectedScheduleId(schedule.id);
                setDetailsDrawerVisible(true);
              }}
            >
              📘 {schedule.subject?.name?.slice(0, 8)}
            </Tag>
          </Tooltip>
        ))}

        {dayExams.slice(0, 2).map((exam) => (
          <Tooltip
            key={`exam-${exam.id}`}
            title={`${exam.name} • ${exam.examType?.name}`}
          >
            <Tag color="purple">📝 {exam.subject?.name?.slice(0, 8)}</Tag>
          </Tooltip>
        ))}

        {dayClasses.length + dayExams.length > 4 && (
          <Tag>+{dayClasses.length + dayExams.length - 4} more</Tag>
        )}
      </div>
    );
  };

  return (
    <Card>
      <Calendar
        value={currentMonth}
        fullscreen
        onChange={setCurrentMonth}
        cellRender={dateCellRender}
      />

      {/* Class details */}
      <ClassScheduleDetailsDrawer
        visible={detailsDrawerVisible}
        classScheduleId={selectedScheduleId}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={(id) => {
          setSelectedScheduleId(id);
          setFormMode('edit');
          setFormDrawerVisible(true);
        }}
      />

      {/* Create / Edit */}
      <ClassScheduleFormDrawer
        visible={formDrawerVisible}
        mode={formMode}
        classScheduleId={selectedScheduleId}
        onCancel={() => setFormDrawerVisible(false)}
        onSuccess={() => setFormDrawerVisible(false)}
      />
    </Card>
  );
}

export default ClassScheduleCalendarView;
