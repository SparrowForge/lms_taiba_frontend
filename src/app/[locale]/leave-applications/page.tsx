'use client';

import { ResourcePage } from '@/components/crud/ResourcePage';
import {
  StatusTag,
  facultyField,
  facultyLabel,
  facultyName,
  fmtDate,
  opts,
} from '@/components/crud/helpers';

import { api } from '@/lib/axios';

interface ILeaveApplication {
  id: number;
  facultyId: number;
  faculty?: { fullName?: string };
  leaveType?: { name?: string };
  leaveTypeId: number;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: string;
  isPaid: boolean;
}

const STATUSES = ['draft', 'pending', 'head_approved', 'approved', 'rejected', 'cancelled'];
const OPEN = ['pending', 'head_approved'];

export default function LeaveApplicationsPage() {
  return (
    <ResourcePage<ILeaveApplication>
      title="Leave Application"
      endpoint="/leave-applications"
      searchable={false}
      canEdit={() => false}
      canDelete={() => false}
      filters={[{ name: 'status', label: 'Status', options: opts(STATUSES) }]}
      fields={[
        facultyField(),
        {
          name: 'leaveTypeId',
          label: 'Leave type',
          type: 'select',
          required: true,
          remote: { url: '/leave-types', label: (r) => r.name, params: { status: 'active' } },
        },
        { name: 'fromDate', label: 'From', type: 'date', required: true },
        { name: 'toDate', label: 'To', type: 'date', required: true },
        { name: 'days', label: 'Days (auto if empty)', type: 'number', min: 0 },
        { name: 'reason', label: 'Reason', type: 'textarea', required: true },
        { name: 'contactDuringLeave', label: 'Contact during leave', type: 'text' },
        {
          name: 'handoverToFacultyId',
          label: 'Hand over to',
          type: 'select',
          remote: { url: '/faculties', label: facultyLabel },
        },
      ]}
      rowActions={[
        {
          label: 'Decide',
          show: (r) => OPEN.includes(r.status),
          fields: [
            {
              name: 'level',
              label: 'Approval level',
              type: 'select',
              required: true,
              options: opts(['head', 'admin']),
            },
            {
              name: 'action',
              label: 'Decision',
              type: 'select',
              required: true,
              options: opts(['approved', 'rejected']),
            },
            { name: 'remarks', label: 'Remarks', type: 'textarea' },
          ],
          run: (r, v) => api.patch(`/leave-applications/${r.id}/decision`, v),
        },
        {
          label: 'Cancel',
          danger: true,
          show: (r) => OPEN.includes(r.status) || r.status === 'approved',
          run: (r) => api.patch(`/leave-applications/${r.id}/cancel`),
        },
      ]}
      columns={[
        { title: 'Employee', key: 'faculty', render: (_, r) => facultyName(r) },
        { title: 'Leave type', key: 'leaveType', render: (_, r) => r.leaveType?.name ?? '—' },
        { title: 'From', dataIndex: 'fromDate', render: (v) => fmtDate(v) },
        { title: 'To', dataIndex: 'toDate', render: (v) => fmtDate(v) },
        { title: 'Days', dataIndex: 'days' },
        { title: 'Paid', dataIndex: 'isPaid', render: (v) => (v ? 'Yes' : 'No') },
        { title: 'Reason', dataIndex: 'reason', ellipsis: true },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
