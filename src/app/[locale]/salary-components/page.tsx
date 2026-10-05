'use client';

import { ResourcePage } from '@/components/crud/ResourcePage';
import { STATUS_OPTIONS, StatusTag, opts, titleCase } from '@/components/crud/helpers';

interface ISalaryComponent {
  id: number;
  name: string;
  code?: string | null;
  type: string;
  calculationType: string;
  defaultValue?: number | null;
  isTaxable: boolean;
  isProRated: boolean;
  displayOrder: number;
  description?: string | null;
  status: string;
}

export default function SalaryComponentsPage() {
  return (
    <ResourcePage<ISalaryComponent>
      title="Salary Component"
      endpoint="/salary-components"
      defaults={{
        type: 'earning',
        calculationType: 'fixed',
        isTaxable: true,
        isProRated: true,
        displayOrder: 0,
        status: 'active',
      }}
      filters={[{ name: 'status', label: 'Status', options: STATUS_OPTIONS }]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: opts(['earning', 'deduction']),
        },
        {
          name: 'calculationType',
          label: 'Calculation',
          type: 'select',
          required: true,
          options: opts(['fixed', 'percent_of_basic', 'percent_of_gross']),
        },
        { name: 'defaultValue', label: 'Default value', type: 'number', min: 0 },
        { name: 'isTaxable', label: 'Taxable', type: 'switch' },
        { name: 'isProRated', label: 'Pro-rated for attendance', type: 'switch' },
        { name: 'displayOrder', label: 'Display order', type: 'number', min: 0 },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
      ]}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Code', dataIndex: 'code', render: (v) => v ?? '—' },
        { title: 'Type', dataIndex: 'type', render: (v) => titleCase(v) },
        { title: 'Calculation', dataIndex: 'calculationType', render: (v) => titleCase(v) },
        { title: 'Default', dataIndex: 'defaultValue', render: (v) => v ?? '—' },
        { title: 'Taxable', dataIndex: 'isTaxable', render: (v) => (v ? 'Yes' : 'No') },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
