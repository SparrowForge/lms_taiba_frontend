'use client';

import { Card, Empty } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { UserType } from '@/enums/user-type.enum';
import { Status } from '@/enums';
import { useAttendances } from '@/hooks/useAttendances';
import { useAuth } from '@/hooks/useAuth';

import { AttendanceBySubject } from './AttendanceBySubject';
import { AttendanceStats } from './AttendanceStats';
import { DailyAttendanceCalendar } from './DailyAttendanceCalendar';

export default function StudentAttendanceRecord() {
  const { loadAttendanceStudents, attendanceStudents, actionStatus } = useAttendances();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (id || user?.type === UserType.STUDENT) {
      loadAttendanceStudents({
        studentId: id ? Number(id) : user?.student?.id,
      });
    }
  }, [id, loadAttendanceStudents, user?.student?.id, user?.type]);

  const data = useMemo(() => {
    if (!attendanceStudents?.length) return null;

    let total = 0;
    let present = 0;
    let absent = 0;

    const subjectMap = new Map<number, any>();
    const calendarMap = new Map<string, number>();

    const student = attendanceStudents[0]?.student;

    attendanceStudents.forEach((row: any) => {
      const pattern = row.attendancePattern || '';

      row.attendances?.forEach((a: any) => {
        const index = a.classNo - 1;
        const mark = pattern[index];

        if (!mark) return;

        total++;
        if (mark === 'p') present++;
        if (mark === 'a') absent++;

        calendarMap.set(a.date, (calendarMap.get(a.date) || 0) + 1);

        const subject = row.subject;
        if (!subject) return;

        const prev = subjectMap.get(subject.id) || {
          code: subject.code,
          name: subject.name,
          present: 0,
          total: 0,
        };

        prev.total++;
        if (mark === 'p') prev.present++;

        subjectMap.set(subject.id, prev);
      });
    });

    return {
      student: {
        firstName: student?.firstName || '',
        lastName: student?.lastName || '',
        registrationNo: student?.registrationNo || '',
      },
      totalClasses: total,
      presentCount: present,
      absentCount: absent,
      lateCount: 0,
      attendanceRate: total ? Number(((present / total) * 100).toFixed(1)) : 0,
      subjects: Array.from(subjectMap.values()).map((s) => ({
        ...s,
        attendanceRate: s.total ? Number(((s.present / s.total) * 100).toFixed(1)) : 0,
      })),
      dailyAttendance: Array.from(calendarMap.entries()).map(
        ([date, count]) => ({ date, count })
      ),
    };
  }, [attendanceStudents]);

  // Loading state
  if (actionStatus.message === Status.LOADING) {
    return <p className="text-center mt-10 text-gray-500">Loading attendance…</p>;
  }

  // Empty state
  if (!data) {
    return (
      <div className="">
        <Card className="">
          <Empty
            description={
              <span className="text-gray-500">
                No attendance data available
              </span>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <main className="mb-24">
      <AttendanceStats
        totalClasses={data.totalClasses}
        presentCount={data.presentCount}
        lateCount={data.lateCount}
        absentCount={data.absentCount}
        attendanceRate={data.attendanceRate}
      />

      <AttendanceBySubject subjects={data.subjects} />

      <DailyAttendanceCalendar
        month="February"
        year={2026}
        attendances={data.dailyAttendance}
      />
    </main>
  );
}