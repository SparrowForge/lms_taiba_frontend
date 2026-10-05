'use client';

import { ResourcePage } from '@/components/crud/ResourcePage';
import { StatusTag, facultyField, facultyName, fmtDate, opts } from '@/components/crud/helpers';

interface IStaffAttendance {
  id: number;
  facultyId: number;
  faculty?: { fullName?: string };
  attendanceDate: string;
  status: string;
  inTime?: string | null;
  outTime?: string | null;
  lateMinutes: number;
  workedHours?: string | null;
  lecturesTaken?: number | null;
  source: string;
  remarks?: string | null;
}

const STATUSES = ['present', 'absent', 'late', 'on_leave', 'holiday', 'weekend', 'half_day'];

export default function StaffAttendancePage() {
  return (
    <ResourcePage<IStaffAttendance>
      title="Staff Attendance"
      endpoint="/staff-attendance"
      searchable={false}
      defaults={{ status: 'present', lateMinutes: 0 }}
      filters={[{ name: 'status', label: 'Status', options: opts(STATUSES) }]}
      fields={[
        facultyField(),
        { name: 'attendanceDate', label: 'Date', type: 'date', required: true },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: opts(STATUSES),
        },
        { name: 'inTime', label: 'In time', type: 'time' },
        { name: 'outTime', label: 'Out time', type: 'time' },
        { name: 'lateMinutes', label: 'Late minutes', type: 'number', min: 0 },
        { name: 'lecturesTaken', label: 'Lectures taken', type: 'number', min: 0 },
        { name: 'remarks', label: 'Remarks', type: 'textarea' },
      ]}
      columns={[
        { title: 'Employee', key: 'faculty', render: (_, r) => facultyName(r) },
        { title: 'Date', dataIndex: 'attendanceDate', render: (v) => fmtDate(v) },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
        { title: 'In', dataIndex: 'inTime', render: (v) => v ?? '—' },
        { title: 'Out', dataIndex: 'outTime', render: (v) => v ?? '—' },
        { title: 'Late (min)', dataIndex: 'lateMinutes' },
        { title: 'Hours', dataIndex: 'workedHours', render: (v) => v ?? '—' },
        { title: 'Source', dataIndex: 'source' },
      ]}
    />
  );
}
