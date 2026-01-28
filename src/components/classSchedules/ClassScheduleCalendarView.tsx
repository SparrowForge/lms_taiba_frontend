'use client';

import { Calendar, Card, Tag, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

import { ClassScheduleStatus } from '@/enums';
import { useAuth } from '@/hooks/useAuth';
import { useClassSchedules } from '@/hooks/useClassSchedules';
import { useExams } from '@/hooks/useExams';

import { IClassSchedule } from '@/types/classSchedule';

import ClassScheduleFormDrawer from './ClassScheduleFormDrawer';
import { ScheduleDetailsDrawer } from '../dashboard/schedule';
import ExamScheduleDetailsDrawer from '../dashboard/schedule/ExamScheduleDetailsDrawer';


function ClassScheduleCalendarView() {
  const { user } = useAuth();

  /* ------------------ State ------------------ */

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  const [classDrawerVisible, setClassDrawerVisible] = useState(false);
  const [examDrawerVisible, setExamDrawerVisible] = useState(false);

  const [selectedSchedule, setSelectedSchedule] =
    useState<IClassSchedule | null>(null);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);

  const [clickedDate, setClickedDate] = useState<string>();

  const [formDrawerVisible, setFormDrawerVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  /* ------------------ Data ------------------ */

  const { classSchedules, loadClassSchedules } = useClassSchedules();
  const { exams, loadExams } = useExams();

  /* ------------------ Load Class Schedules ------------------ */

  useEffect(() => {
    if (!user?.faculty?.id) return;

    if (user.role === 'FACULTY') {
      loadClassSchedules({
        page: 1,
        limit: 100,
        facultyId: user?.faculty?.id,
        month: currentMonth.month() + 1,
        year: currentMonth.year(),
      });
    }
  }, [currentMonth, loadClassSchedules, user?.faculty?.id, user.role]);

  /* ------------------ Load Exams ------------------ */

  useEffect(() => {
    if (!user?.student?.batchId) return;

    loadExams({
      page: 1,
      limit: 100,
      batchId: user.student.batchId,
    });
  }, [user?.student?.batchId, loadExams]);

  /* ------------------ Handlers ------------------ */

  const handleClassClick = (schedule: IClassSchedule, date: string) => {
    setSelectedSchedule(schedule);
    setClickedDate(date);
    setClassDrawerVisible(true);
  };

  const handleExamClick = (exam: any, date: string) => {
    setSelectedExam(exam);
    setClickedDate(date);
    setExamDrawerVisible(true);
  };

  const closeClassDrawer = () => {
    setClassDrawerVisible(false);
    setSelectedSchedule(null);
    setClickedDate(undefined);
  };

  const closeExamDrawer = () => {
    setExamDrawerVisible(false);
    setSelectedExam(null);
    setClickedDate(undefined);
  };

  /* ------------------ Group Classes ------------------ */

  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, IClassSchedule[]> = {};

    classSchedules.forEach((schedule) => {
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);

      if (schedule.isRecurring && schedule.weekDay?.dayNumber != null) {
        const monthStart = currentMonth.startOf('month');
        let currentDate = monthStart;

        while (currentDate.day() !== schedule.weekDay.dayNumber % 7) {
          currentDate = currentDate.add(1, 'day');
        }

        while (currentDate.isSame(monthStart, 'month')) {
          if (
            currentDate.isSame(startDate, 'day') ||
            (currentDate.isAfter(startDate) &&
              (currentDate.isBefore(endDate) ||
                currentDate.isSame(endDate, 'day')))
          ) {
            const key = currentDate.format('YYYY-MM-DD');
            grouped[key] ??= [];
            grouped[key].push(schedule);
          }
          currentDate = currentDate.add(7, 'day');
        }
      } else if (startDate.isSame(currentMonth, 'month')) {
        const key = startDate.format('YYYY-MM-DD');
        grouped[key] ??= [];
        grouped[key].push(schedule);
      }
    });

    return grouped;
  }, [classSchedules, currentMonth]);

  /* ------------------ Group Exams ------------------ */

  const examsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    exams.forEach((exam: any) => {
      const key = dayjs(exam.examDatetime).format('YYYY-MM-DD');
      grouped[key] ??= [];
      grouped[key].push(exam);
    });

    return grouped;
  }, [exams]);

  /* ------------------ Helpers ------------------ */

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

  /* ------------------ Calendar Cell ------------------ */

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
              onClick={() => handleClassClick(schedule, key)}
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
            <Tag
              color="purple"
              className="cursor-pointer"
              onClick={() => handleExamClick(exam, key)}
            >
              📝 {exam.subject?.name?.slice(0, 8)}
            </Tag>
          </Tooltip>
        ))}

        {dayClasses.length + dayExams.length > 4 && (
          <Tag>+{dayClasses.length + dayExams.length - 4} more</Tag>
        )}
      </div>
    );
  };

  /* ------------------ Render ------------------ */

  return (
    <Card>
      <Calendar
        fullscreen
        value={currentMonth}
        onChange={setCurrentMonth}
        cellRender={dateCellRender}
      />

      {/* Class Schedule Drawer */}
      <ScheduleDetailsDrawer
        visible={classDrawerVisible}
        schedule={selectedSchedule}
        clickedDate={clickedDate}
        onClose={closeClassDrawer}
      />

      {/* Exam Schedule Drawer */}
      <ExamScheduleDetailsDrawer
        visible={examDrawerVisible}
        exam={selectedExam}
        clickedDate={clickedDate}
        onClose={closeExamDrawer}
      />

      {/* Create / Edit Class Schedule */}
      <ClassScheduleFormDrawer
        visible={formDrawerVisible}
        mode={formMode}
        classScheduleId={selectedSchedule?.id}
        onCancel={() => setFormDrawerVisible(false)}
        onSuccess={() => setFormDrawerVisible(false)}
      />
    </Card>
  );
}

export default ClassScheduleCalendarView;
