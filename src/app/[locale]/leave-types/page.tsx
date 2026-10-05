'use client';

import { ResourcePage } from '@/components/crud/ResourcePage';
import { STATUS_OPTIONS, StatusTag } from '@/components/crud/helpers';

interface ILeaveType {
  id: number;
  name: string;
  code?: string | null;
  annualQuota: number;
  isPaid: boolean;
  canCarryForward: boolean;
  maxCarryForwardDays?: number | null;
  trackBalance: boolean;
  description?: string | null;
  status: string;
}

export default function LeaveTypesPage() {
  return (
    <ResourcePage<ILeaveType>
      title="Leave Type"
      endpoint="/leave-types"
      defaults={{
        annualQuota: 0,
        isPaid: true,
        canCarryForward: false,
        trackBalance: true,
        status: 'active',
      }}
      filters={[{ name: 'status', label: 'Status', options: STATUS_OPTIONS }]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'annualQuota', label: 'Annual quota (days)', type: 'number', min: 0 },
        { name: 'isPaid', label: 'Paid leave', type: 'switch' },
        { name: 'canCarryForward', label: 'Can carry forward', type: 'switch' },
        { name: 'maxCarryForwardDays', label: 'Max carry-forward days', type: 'number', min: 0 },
        { name: 'trackBalance', label: 'Track balance', type: 'switch' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
      ]}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Code', dataIndex: 'code', render: (v) => v ?? '—' },
        { title: 'Annual quota', dataIndex: 'annualQuota' },
        { title: 'Paid', dataIndex: 'isPaid', render: (v) => (v ? 'Yes' : 'No') },
        { title: 'Carry forward', dataIndex: 'canCarryForward', render: (v) => (v ? 'Yes' : 'No') },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
