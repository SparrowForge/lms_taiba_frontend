'use client';

import { ResourcePage } from '@/components/crud/ResourcePage';
import { MONTH_OPTIONS, StatusTag, fmtDate, fmtMoney, opts } from '@/components/crud/helpers';

import { api } from '@/lib/axios';

interface IPayrollPeriod {
  id: number;
  name: string;
  year: number;
  month: number;
  branch?: { name?: string } | null;
  startDate: string;
  endDate: string;
  totalWorkingDays: number;
  status: string;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
}

const STATUSES = ['draft', 'pending_review', 'reviewed', 'approved', 'locked', 'cancelled'];
const IN_APPROVAL = ['pending_review', 'reviewed'];

export default function PayrollPeriodsPage() {
  return (
    <ResourcePage<IPayrollPeriod>
      title="Payroll Period"
      endpoint="/payroll-periods"
      searchable={false}
      canEdit={() => false}
      canDelete={(r) => r.status === 'draft'}
      defaults={{ year: new Date().getFullYear(), month: new Date().getMonth() + 1 }}
      filters={[{ name: 'status', label: 'Status', options: opts(STATUSES) }]}
      fields={[
        { name: 'name', label: 'Name (optional)', type: 'text' },
        { name: 'year', label: 'Year', type: 'number', required: true, min: 2000, max: 2100 },
        { name: 'month', label: 'Month', type: 'select', required: true, options: MONTH_OPTIONS },
        {
          name: 'branchId',
          label: 'Branch (all if empty)',
          type: 'select',
          remote: { url: '/branches', label: (r) => r.name },
        },
        { name: 'totalWorkingDays', label: 'Working days', type: 'number', min: 1, max: 31 },
        { name: 'remarks', label: 'Remarks', type: 'textarea' },
      ]}
      rowActions={[
        {
          label: 'Calculate',
          show: (r) => r.status === 'draft',
          run: (r) => api.post(`/payroll-periods/${r.id}/calculate`),
        },
        {
          label: 'Approval',
          show: (r) => IN_APPROVAL.includes(r.status),
          fields: [
            {
              name: 'level',
              label: 'Approval level',
              type: 'select',
              required: true,
              options: opts(['hr', 'accounts', 'admin']),
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
          run: (r, v) => api.patch(`/payroll-periods/${r.id}/approval`, v),
        },
        {
          label: 'Lock',
          show: (r) => r.status === 'approved',
          run: (r) => api.patch(`/payroll-periods/${r.id}/lock`),
        },
      ]}
      columns={[
        { title: 'Period', dataIndex: 'name' },
        { title: 'Branch', key: 'branch', render: (_, r) => r.branch?.name ?? 'All' },
        {
          title: 'Dates',
          key: 'dates',
          render: (_, r) => `${fmtDate(r.startDate)} → ${fmtDate(r.endDate)}`,
        },
        { title: 'Employees', dataIndex: 'employeeCount' },
        { title: 'Gross', dataIndex: 'totalGross', align: 'right', render: (v) => fmtMoney(v) },
        {
          title: 'Deductions',
          dataIndex: 'totalDeductions',
          align: 'right',
          render: (v) => fmtMoney(v),
        },
        { title: 'Net', dataIndex: 'totalNet', align: 'right', render: (v) => fmtMoney(v) },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
