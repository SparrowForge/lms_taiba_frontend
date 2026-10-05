'use client';

import { Alert, Card, Checkbox, Space, Table, Tabs, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StatusTag, titleCase } from '@/components/crud/helpers';
import { MainLayout } from '@/components/layout/MainLayout';
import { LeadStageTag } from '@/components/leads/leadConfig';
import LeadDetailsDrawer from '@/components/leads/LeadDetailsDrawer';

import { ILead, ILeadActivity } from '@/types/lead';

import { api } from '@/lib/axios';

type DueActivity = ILeadActivity & { lead?: { id: number; firstName?: string; lastName?: string } };

const dt = (v?: string | null) => (v ? new Date(v).toLocaleString() : '—');
const leadName = (l?: { firstName?: string; lastName?: string }) =>
  [l?.firstName, l?.lastName].filter(Boolean).join(' ') || '—';

export default function LeadFollowUpsPage() {
  const router = useRouter();
  const [mine, setMine] = useState(true);
  const [leads, setLeads] = useState<ILead[]>([]);
  const [activities, setActivities] = useState<DueActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = mine ? { mine: true } : {};
      const [l, a] = await Promise.all([
        api.get('/leads/follow-ups/due', { params }),
        api.get('/leads/activities/due/list', { params }),
      ]);
      setLeads(l.data?.data ?? []);
      setActivities(a.data?.data ?? []);
    } catch (e) {
      setError((e as Error)?.message ?? 'Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  }, [mine]);

  useEffect(() => {
    load();
  }, [load]);

  const openLead = (id?: number) => {
    if (!id) return;
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <Card>
          <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Follow-ups
            </Typography.Title>
            <Checkbox checked={mine} onChange={(e) => setMine(e.target.checked)}>
              Only mine
            </Checkbox>
          </Space>

          {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

          <Tabs
            items={[
              {
                key: 'leads',
                label: `Leads due (${leads.length})`,
                children: (
                  <Table<ILead>
                    rowKey="id"
                    loading={loading}
                    dataSource={leads}
                    scroll={{ x: 'max-content' }}
                    onRow={(r) => ({ onClick: () => openLead(r.id), style: { cursor: 'pointer' } })}
                    columns={[
                      { title: 'Lead no', dataIndex: 'leadNo' },
                      { title: 'Name', key: 'name', render: (_, r) => leadName(r) },
                      { title: 'Phone', dataIndex: 'phone', render: (v) => v ?? '—' },
                      {
                        title: 'Stage',
                        dataIndex: 'stage',
                        render: (v) => <LeadStageTag stage={v} />,
                      },
                      { title: 'Follow-up was due', dataIndex: 'nextFollowUpAt', render: dt },
                    ]}
                  />
                ),
              },
              {
                key: 'activities',
                label: `Activities due (${activities.length})`,
                children: (
                  <Table<DueActivity>
                    rowKey="id"
                    loading={loading}
                    dataSource={activities}
                    scroll={{ x: 'max-content' }}
                    onRow={(r) => ({
                      onClick: () => openLead(r.leadId),
                      style: { cursor: 'pointer' },
                    })}
                    columns={[
                      { title: 'Lead', key: 'lead', render: (_, r) => leadName(r.lead) },
                      { title: 'Type', dataIndex: 'type', render: (v) => titleCase(v) },
                      { title: 'Subject', dataIndex: 'subject', ellipsis: true },
                      { title: 'Scheduled', dataIndex: 'scheduledAt', render: dt },
                      {
                        title: 'Outcome',
                        dataIndex: 'outcome',
                        render: (v) => <StatusTag value={v} />,
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        </Card>

        <LeadDetailsDrawer
          leadId={selectedId}
          visible={open}
          onClose={() => setOpen(false)}
          onEdit={(id) => router.push(`/leads/${id}/edit`)}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
