'use client';

import { Tag } from 'antd';

import { ResourcePage } from '@/components/crud/ResourcePage';
import { STATUS_OPTIONS, StatusTag } from '@/components/crud/helpers';

import { ILeadSource } from '@/types/lead';

export default function LeadSourcesPage() {
  return (
    <ResourcePage<ILeadSource>
      title="Lead Source"
      endpoint="/lead-sources"
      defaults={{ isPublic: false, status: 'active' }}
      filters={[{ name: 'status', label: 'Status', options: STATUS_OPTIONS }]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'isPublic', label: 'Public on web form', type: 'switch' },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
      ]}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Code', dataIndex: 'code', render: (v) => v ?? '—' },
        {
          title: 'Public',
          dataIndex: 'isPublic',
          render: (v: boolean) => (v ? <Tag color="blue">Public</Tag> : <Tag>Internal</Tag>),
        },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
