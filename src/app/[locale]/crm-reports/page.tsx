'use client';

import {
  Alert,
  Button,
  Card,
  DatePicker,
  Progress,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RemotePicker } from '@/components/crud/RemotePicker';
import { MainLayout } from '@/components/layout/MainLayout';
import { leadStageLabel } from '@/components/leads/leadConfig';

import { ILeadFunnelStats } from '@/types/lead';

import { api } from '@/lib/axios';

import type { Dayjs } from 'dayjs';

export default function CrmReportsPage() {
  const [branchId, setBranchId] = useState<number | undefined>();
  const [courseId, setCourseId] = useState<number | undefined>();
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [stats, setStats] = useState<ILeadFunnelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/leads/stats/funnel', {
        params: {
          branchId,
          courseId,
          from: range?.[0]?.format('YYYY-MM-DD'),
          to: range?.[1]?.format('YYYY-MM-DD'),
        },
      });
      setStats(res.data?.data ?? null);
    } catch (e) {
      setStats(null);
      setError((e as Error)?.message ?? 'Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [branchId, courseId, range]);

  useEffect(() => {
    load();
  }, [load]);

  const pct = (n: number) => (stats?.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <ProtectedRoute>
      <MainLayout>
        <Card>
          <Typography.Title level={4}>CRM Reports</Typography.Title>

          <Space wrap style={{ marginBottom: 16 }}>
            <RemotePicker
              url="/branches"
              label={(r) => r.name}
              value={branchId}
              onChange={setBranchId}
              placeholder="All branches"
            />
            <RemotePicker
              url="/courses"
              label={(r) => r.name}
              value={courseId}
              onChange={setCourseId}
              placeholder="All courses"
            />
            <DatePicker.RangePicker value={range} onChange={(v) => setRange(v)} />
            <Button onClick={load} loading={loading}>
              Refresh
            </Button>
          </Space>

          {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

          {stats && (
            <>
              <Space size="large" wrap style={{ marginBottom: 24 }}>
                <Statistic title="Total leads" value={stats.total} />
                <Statistic title="Open" value={stats.open} />
                <Statistic title="Enrolled" value={stats.enrolled} />
                <Statistic title="Lost" value={stats.lost} />
                <Statistic
                  title="Conversion"
                  value={stats.conversionRate}
                  suffix="%"
                  precision={2}
                />
              </Space>

              <Typography.Title level={5}>By stage</Typography.Title>
              <Table
                size="small"
                rowKey="stage"
                pagination={false}
                dataSource={stats.byStage}
                style={{ marginBottom: 24 }}
                columns={[
                  { title: 'Stage', dataIndex: 'stage', render: (v) => leadStageLabel(v) },
                  { title: 'Leads', dataIndex: 'count', align: 'right' },
                  {
                    title: 'Share',
                    key: 'share',
                    width: 240,
                    render: (_, r) => <Progress percent={pct(r.count)} size="small" />,
                  },
                ]}
              />

              <Typography.Title level={5}>By source</Typography.Title>
              <Table
                size="small"
                rowKey={(r) => String(r.sourceId ?? 'none')}
                pagination={false}
                dataSource={stats.bySource}
                columns={[
                  { title: 'Source', dataIndex: 'sourceName', render: (v) => v || 'Unknown' },
                  { title: 'Leads', dataIndex: 'count', align: 'right' },
                  {
                    title: 'Share',
                    key: 'share',
                    width: 240,
                    render: (_, r) => <Progress percent={pct(r.count)} size="small" />,
                  },
                ]}
              />
            </>
          )}
        </Card>
      </MainLayout>
    </ProtectedRoute>
  );
}
