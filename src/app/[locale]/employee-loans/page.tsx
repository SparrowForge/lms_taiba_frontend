'use client';

import { ResourcePage } from '@/components/crud/ResourcePage';
import {
  MONTH_OPTIONS,
  StatusTag,
  facultyField,
  facultyName,
  fmtMoney,
  opts,
  titleCase,
} from '@/components/crud/helpers';

import { api } from '@/lib/axios';

interface IEmployeeLoan {
  id: number;
  loanNo: string;
  facultyId: number;
  faculty?: { fullName?: string };
  type: string;
  principalAmount: number;
  installmentAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  outstandingAmount: number;
  startMonth: number;
  startYear: number;
  status: string;
  purpose?: string | null;
}

const STATUSES = ['pending', 'approved', 'disbursed', 'active', 'settled', 'rejected', 'cancelled'];

export default function EmployeeLoansPage() {
  return (
    <ResourcePage<IEmployeeLoan>
      title="Employee Loan"
      endpoint="/employee-loans"
      searchable={false}
      canEdit={(r) => r.status === 'pending'}
      canDelete={(r) => ['pending', 'rejected', 'cancelled'].includes(r.status)}
      defaults={{
        type: 'loan',
        startYear: new Date().getFullYear(),
        startMonth: new Date().getMonth() + 1,
      }}
      filters={[{ name: 'status', label: 'Status', options: opts(STATUSES) }]}
      fields={[
        facultyField(),
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: opts(['loan', 'salary_advance']),
        },
        {
          name: 'principalAmount',
          label: 'Principal amount',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'totalInstallments',
          label: 'Number of installments',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'installmentAmount',
          label: 'Installment amount (auto if empty)',
          type: 'number',
          min: 0,
        },
        {
          name: 'startMonth',
          label: 'Start month',
          type: 'select',
          required: true,
          options: MONTH_OPTIONS,
        },
        {
          name: 'startYear',
          label: 'Start year',
          type: 'number',
          required: true,
          min: 2000,
          max: 2100,
        },
        { name: 'purpose', label: 'Purpose', type: 'text' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' },
      ]}
      rowActions={[
        {
          label: 'Decide',
          show: (r) => r.status === 'pending',
          fields: [
            {
              name: 'status',
              label: 'Decision',
              type: 'select',
              required: true,
              options: opts(['approved', 'rejected']),
            },
            { name: 'remarks', label: 'Remarks', type: 'textarea' },
          ],
          run: (r, v) => api.patch(`/employee-loans/${r.id}/decision`, v),
        },
        {
          label: 'Disburse',
          show: (r) => r.status === 'approved',
          fields: [
            { name: 'disbursedAt', label: 'Disbursed on', type: 'date' },
            { name: 'remarks', label: 'Remarks', type: 'textarea' },
          ],
          run: (r, v) => api.patch(`/employee-loans/${r.id}/disburse`, v),
        },
        {
          label: 'Cancel',
          danger: true,
          show: (r) => ['pending', 'approved'].includes(r.status),
          run: (r) => api.patch(`/employee-loans/${r.id}/cancel`),
        },
      ]}
      columns={[
        { title: 'Loan no', dataIndex: 'loanNo' },
        { title: 'Employee', key: 'faculty', render: (_, r) => facultyName(r) },
        { title: 'Type', dataIndex: 'type', render: (v) => titleCase(v) },
        {
          title: 'Principal',
          dataIndex: 'principalAmount',
          align: 'right',
          render: (v) => fmtMoney(v),
        },
        {
          title: 'Installment',
          dataIndex: 'installmentAmount',
          align: 'right',
          render: (v) => fmtMoney(v),
        },
        {
          title: 'Paid',
          key: 'paid',
          render: (_, r) => `${r.paidInstallments}/${r.totalInstallments}`,
        },
        {
          title: 'Outstanding',
          dataIndex: 'outstandingAmount',
          align: 'right',
          render: (v) => fmtMoney(v),
        },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
