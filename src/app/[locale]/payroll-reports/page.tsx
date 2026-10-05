'use client';

import { DownloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Empty, InputNumber, Select, Space, Table, Typography } from 'antd';
import { useState } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RemotePicker } from '@/components/crud/RemotePicker';
import { titleCase } from '@/components/crud/helpers';
import { MainLayout } from '@/components/layout/MainLayout';

import { api } from '@/lib/axios';

interface ReportDef {
  key: string;
  label: string;
  /** What the report needs: a payroll period, a year, a comparison period, or nothing. */
  needs: Array<'period' | 'year' | 'compare'>;
  path: (p: { periodId?: number; compareId?: number }) => string;
  csv?: boolean;
}

const REPORTS: ReportDef[] = [
  {
    key: 'salary-sheet',
    label: 'Salary sheet',
    needs: ['period'],
    csv: true,
    path: ({ periodId }) => `/payroll-reports/salary-sheet/${periodId}`,
  },
  {
    key: 'bank-advice',
    label: 'Bank advice',
    needs: ['period'],
    csv: true,
    path: ({ periodId }) => `/payroll-reports/bank-advice/${periodId}`,
  },
  {
    key: 'monthly',
    label: 'Monthly payroll',
    needs: ['period'],
    path: ({ periodId }) => `/payroll-reports/monthly/${periodId}`,
  },
  {
    key: 'department-wise',
    label: 'Department-wise',
    needs: ['period'],
    path: ({ periodId }) => `/payroll-reports/department-wise/${periodId}`,
  },
  {
    key: 'tax',
    label: 'Tax',
    needs: ['period'],
    path: ({ periodId }) => `/payroll-reports/tax/${periodId}`,
  },
  {
    key: 'attendance-deductions',
    label: 'Attendance deductions',
    needs: ['period'],
    path: ({ periodId }) => `/payroll-reports/attendance-deductions/${periodId}`,
  },
  {
    key: 'variance',
    label: 'Period variance',
    needs: ['period', 'compare'],
    path: ({ periodId }) => `/payroll-reports/variance/${periodId}`,
  },
  {
    key: 'loan-outstanding',
    label: 'Loan outstanding',
    needs: [],
    path: () => '/payroll-reports/loan-outstanding',
  },
  {
    key: 'leave-balances',
    label: 'Leave balances',
    needs: ['year'],
    path: () => '/payroll-reports/leave-balances',
  },
];

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const cell = (v: unknown): string => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
};

/** Finds the first array of row objects in a report payload (the report's main table). */
const findRows = (data: unknown): Record<string, unknown>[] | null => {
  if (Array.isArray(data))
    return data.every(isPlainObject) ? (data as Record<string, unknown>[]) : null;
  if (isPlainObject(data)) {
    for (const value of Object.values(data)) {
      const rows = findRows(value);
      if (rows && rows.length) return rows;
    }
  }
  return null;
};

const errorMessage = (e: unknown): string =>
  (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
  (e as Error)?.message ??
  'Failed to load report';

export default function PayrollReportsPage() {
  const [reportKey, setReportKey] = useState(REPORTS[0].key);
  const [periodId, setPeriodId] = useState<number | undefined>();
  const [compareId, setCompareId] = useState<number | undefined>();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const report = REPORTS.find((r) => r.key === reportKey) ?? REPORTS[0];
  const ready =
    (!report.needs.includes('period') || !!periodId) &&
    (!report.needs.includes('compare') || !!compareId);

  const params = () => ({
    ...(report.needs.includes('year') ? { year } : {}),
    ...(report.needs.includes('compare') ? { comparePeriodId: compareId } : {}),
  });

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(report.path({ periodId }), { params: params() });
      setData(res.data?.data ?? res.data);
    } catch (e) {
      setData(null);
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async () => {
    try {
      const res = await api.get(`${report.path({ periodId })}/csv`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.key}-${periodId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const rows = findRows(data);
  const summary = isPlainObject(data)
    ? Object.entries(data).filter(([, v]) => v === null || typeof v !== 'object')
    : [];

  return (
    <ProtectedRoute>
      <MainLayout>
        <Card>
          <Typography.Title level={4}>Payroll Reports</Typography.Title>

          <Space wrap style={{ marginBottom: 16 }}>
            <Select
              style={{ width: 220 }}
              value={reportKey}
              onChange={(v) => {
                setReportKey(v);
                setData(null);
                setError(null);
              }}
              options={REPORTS.map((r) => ({ value: r.key, label: r.label }))}
            />
            {report.needs.includes('period') && (
              <RemotePicker
                url="/payroll-periods"
                label={(r) => r.name}
                value={periodId}
                onChange={setPeriodId}
                placeholder="Payroll period"
              />
            )}
            {report.needs.includes('compare') && (
              <RemotePicker
                url="/payroll-periods"
                label={(r) => r.name}
                value={compareId}
                onChange={setCompareId}
                placeholder="Compare with period"
              />
            )}
            {report.needs.includes('year') && (
              <InputNumber min={2000} max={2100} value={year} onChange={(v) => v && setYear(v)} />
            )}
            <Button type="primary" disabled={!ready} loading={loading} onClick={run}>
              Run report
            </Button>
            {report.csv && (
              <Button icon={<DownloadOutlined />} disabled={!periodId} onClick={downloadCsv}>
                CSV
              </Button>
            )}
          </Space>

          {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

          {summary.length > 0 && (
            <Space size="large" wrap style={{ marginBottom: 16 }}>
              {summary.map(([k, v]) => (
                <div key={k}>
                  <Typography.Text type="secondary">
                    {titleCase(k.replace(/([A-Z])/g, '_$1').toLowerCase())}
                  </Typography.Text>
                  <div style={{ fontWeight: 600 }}>{cell(v)}</div>
                </div>
              ))}
            </Space>
          )}

          {rows && rows.length > 0 ? (
            <Table
              size="small"
              loading={loading}
              rowKey={(_, i) => String(i)}
              scroll={{ x: 'max-content' }}
              dataSource={rows}
              columns={Object.keys(rows[0]).map((k) => ({
                title: titleCase(k.replace(/([A-Z])/g, '_$1').toLowerCase()),
                dataIndex: k,
                render: (v: unknown) => cell(v),
              }))}
            />
          ) : (
            !loading && !error && data !== null && <Empty description="No rows for this report" />
          )}
        </Card>
      </MainLayout>
    </ProtectedRoute>
  );
}
