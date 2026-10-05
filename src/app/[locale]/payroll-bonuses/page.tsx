'use client';

import { useState } from 'react';

import { RemotePicker } from '@/components/crud/RemotePicker';
import { ResourcePage } from '@/components/crud/ResourcePage';
import { StatusTag, fmtMoney, opts, titleCase } from '@/components/crud/helpers';

interface IPayrollBonus {
  id: number;
  name: string;
  type: string;
  payrollPeriodId: number;
  salaryComponent?: { name?: string };
  calculationType: string;
  value: number;
  minimumServiceMonths?: number | null;
  remarks?: string | null;
  status: string;
}

export default function PayrollBonusesPage() {
  const [periodId, setPeriodId] = useState<number | undefined>();

  return (
    <ResourcePage<IPayrollBonus>
      title="Payroll Bonus"
      endpoint="/payroll-bonuses"
      listUrl={periodId ? `/payroll-bonuses/period/${periodId}` : null}
      serverPaged={false}
      searchable={false}
      defaults={{ payrollPeriodId: periodId, type: 'festival', calculationType: 'fixed' }}
      toolbar={
        <RemotePicker
          url="/payroll-periods"
          label={(r) => r.name}
          value={periodId}
          onChange={setPeriodId}
          placeholder="Select payroll period"
        />
      }
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: opts(['festival', 'performance', 'annual', 'other']),
        },
        {
          name: 'payrollPeriodId',
          label: 'Payroll period',
          type: 'select',
          required: true,
          remote: { url: '/payroll-periods', label: (r) => r.name },
        },
        {
          name: 'salaryComponentId',
          label: 'Salary component',
          type: 'select',
          required: true,
          remote: { url: '/salary-components', label: (r) => r.name, params: { status: 'active' } },
        },
        {
          name: 'calculationType',
          label: 'Calculation',
          type: 'select',
          options: opts(['fixed', 'percent_of_basic']),
        },
        { name: 'value', label: 'Value', type: 'number', required: true, min: 0 },
        { name: 'minimumServiceMonths', label: 'Minimum service (months)', type: 'number', min: 0 },
        { name: 'remarks', label: 'Remarks', type: 'textarea' },
      ]}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Type', dataIndex: 'type', render: (v) => titleCase(v) },
        { title: 'Component', key: 'component', render: (_, r) => r.salaryComponent?.name ?? '—' },
        { title: 'Calculation', dataIndex: 'calculationType', render: (v) => titleCase(v) },
        { title: 'Value', dataIndex: 'value', align: 'right', render: (v) => fmtMoney(v) },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
