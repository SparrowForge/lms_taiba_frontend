'use client';

import { useState } from 'react';

import { RemotePicker } from '@/components/crud/RemotePicker';
import { ResourcePage } from '@/components/crud/ResourcePage';
import {
  StatusTag,
  facultyField,
  facultyLabel,
  fmtDate,
  fmtMoney,
} from '@/components/crud/helpers';

interface ISalaryStructure {
  id: number;
  facultyId: number;
  basicSalary: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  payrollDaysInMonth: number;
  remarks?: string | null;
  components?: Array<{ id: number }>;
  status: string;
}

export default function SalaryStructuresPage() {
  const [facultyId, setFacultyId] = useState<number | undefined>();

  return (
    <ResourcePage<ISalaryStructure>
      title="Salary Structure"
      endpoint="/salary-structures"
      listUrl={facultyId ? `/salary-structures/employee/${facultyId}` : null}
      serverPaged={false}
      searchable={false}
      defaults={{ facultyId, payrollDaysInMonth: 30 }}
      toolbar={
        <RemotePicker
          url="/faculties"
          label={facultyLabel}
          value={facultyId}
          onChange={setFacultyId}
          placeholder="Select employee to view structures"
        />
      }
      fields={[
        facultyField(),
        { name: 'basicSalary', label: 'Basic salary', type: 'number', required: true, min: 0 },
        { name: 'effectiveFrom', label: 'Effective from', type: 'date', required: true },
        {
          name: 'payrollDaysInMonth',
          label: 'Payroll days in month',
          type: 'number',
          min: 1,
          max: 31,
        },
        { name: 'remarks', label: 'Remarks', type: 'textarea' },
      ]}
      columns={[
        {
          title: 'Basic salary',
          dataIndex: 'basicSalary',
          align: 'right',
          render: (v) => fmtMoney(v),
        },
        { title: 'Effective from', dataIndex: 'effectiveFrom', render: (v) => fmtDate(v) },
        { title: 'Effective to', dataIndex: 'effectiveTo', render: (v) => fmtDate(v) },
        { title: 'Days / month', dataIndex: 'payrollDaysInMonth' },
        { title: 'Components', key: 'components', render: (_, r) => r.components?.length ?? 0 },
        { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
      ]}
    />
  );
}
