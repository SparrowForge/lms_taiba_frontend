'use client';

import { ResourcePage } from '@/components/crud/ResourcePage';
import { STATUS_OPTIONS, StatusTag, opts, titleCase } from '@/components/crud/helpers';

interface IDesignation {
  id: number;
  name: string;
  code?: string | null;
  staffType?: string | null;
  rank?: number | null;
  description?: string | null;
  status: string;
}

export default function DesignationsPage() {
  return (
    <ResourcePage<IDesignation>
      title="Designation"
      endpoint="/designations"
      defaults={{ status: 'active' }}
      filters={[{ name: 'status', label: 'Status', options: STATUS_OPTIONS }]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        {
          name: 'staffType',
          label: 'Staff type',
          type: 'select',
          options: opts(['academic', 'administrative', 'accounts', 'it', 'support']),
        },
        { name: 'rank', label: 'Rank', type: 'number', min: 0 },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
      ]}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Code', dataIndex: 'code', render: (v) => v ?? '—' },
        { title: 'Staff type', dataIndex: 'staffType', render: (v) => (v ? titleCase(v) : '—') },
        { title: 'Rank', dataIndex: 'rank', render: (v) => v ?? '—' },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
