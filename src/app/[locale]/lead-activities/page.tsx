'use client';

import { useState } from 'react';

import { RemotePicker } from '@/components/crud/RemotePicker';
import { ResourcePage } from '@/components/crud/ResourcePage';
import { StatusTag, opts, titleCase } from '@/components/crud/helpers';

import { ILeadActivity } from '@/types/lead';

const TYPES = [
  'call',
  'email',
  'sms',
  'whatsapp',
  'meeting',
  'campus_visit',
  'note',
  'stage_change',
  'assignment',
];

const dt = (v?: string | null) => (v ? new Date(v).toLocaleString() : '—');

/**
 * The API lists activities per lead, so this page picks a lead first. New
 * activities are logged from the lead's own page (Leads → view); here they can
 * be reviewed and removed.
 */
export default function LeadActivitiesPage() {
  const [leadId, setLeadId] = useState<number | undefined>();

  return (
    <ResourcePage<ILeadActivity>
      title="Lead Activity"
      endpoint="/leads/activities"
      listUrl={leadId ? `/leads/${leadId}/activities` : null}
      searchable={false}
      canDelete={(r) => !r.isSystemGenerated}
      filters={[{ name: 'type', label: 'Type', options: opts(TYPES) }]}
      toolbar={
        <RemotePicker
          url="/leads"
          label={(r) => [r.leadNo, r.firstName, r.lastName].filter(Boolean).join(' ')}
          value={leadId}
          onChange={setLeadId}
          placeholder="Select a lead"
          width={280}
        />
      }
      columns={[
        { title: 'Type', dataIndex: 'type', render: (v) => titleCase(v) },
        { title: 'Subject', dataIndex: 'subject', ellipsis: true },
        { title: 'Notes', dataIndex: 'notes', ellipsis: true, render: (v) => v ?? '—' },
        { title: 'Outcome', dataIndex: 'outcome', render: (v) => <StatusTag value={v} /> },
        { title: 'Scheduled', dataIndex: 'scheduledAt', render: dt },
        { title: 'Completed', dataIndex: 'completedAt', render: dt },
        { title: 'By', key: 'by', render: (_, r) => r.performedBy?.name ?? '—' },
        { title: 'Logged', dataIndex: 'createdAt', render: dt },
      ]}
    />
  );
}
