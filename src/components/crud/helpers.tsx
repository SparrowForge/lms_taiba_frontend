import { Tag } from 'antd';

import type { FieldDef, SelectOption } from './ResourcePage';

export const titleCase = (value: string): string =>
  value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const opts = (values: string[]): SelectOption[] =>
  values.map((value) => ({ value, label: titleCase(value) }));

export const STATUS_OPTIONS = opts(['active', 'inactive']);

export const MONTH_OPTIONS: SelectOption[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label, i) => ({ label, value: i + 1 }));

export const facultyLabel = (f: { fullName?: string; employeeCode?: string }): string =>
  [f.fullName, f.employeeCode && `(${f.employeeCode})`].filter(Boolean).join(' ');

export const facultyField = (name = 'facultyId', label = 'Employee'): FieldDef => ({
  name,
  label,
  type: 'select',
  required: true,
  remote: { url: '/faculties', label: facultyLabel },
});

const COLORS: Record<string, string> = {
  active: 'green',
  approved: 'green',
  paid: 'green',
  present: 'green',
  disbursed: 'blue',
  settled: 'default',
  locked: 'purple',
  pending: 'gold',
  pending_review: 'gold',
  head_approved: 'cyan',
  reviewed: 'cyan',
  late: 'orange',
  half_day: 'orange',
  rejected: 'red',
  absent: 'red',
  cancelled: 'default',
  inactive: 'default',
};

export const StatusTag = ({ value }: { value?: string | null }) =>
  value ? <Tag color={COLORS[value] ?? 'default'}>{titleCase(value)}</Tag> : <>—</>;

export const facultyName = (row: { faculty?: { fullName?: string }; facultyId?: number }): string =>
  row.faculty?.fullName ?? (row.facultyId ? `#${row.facultyId}` : '—');

export const fmtDate = (v?: string | null): string => (v ? String(v).slice(0, 10) : '—');

export const fmtMoney = (v?: number | string | null): string =>
  v === null || v === undefined || v === ''
    ? '—'
    : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
