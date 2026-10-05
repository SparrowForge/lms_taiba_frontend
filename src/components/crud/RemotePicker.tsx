'use client';

import { Select } from 'antd';
import { useEffect, useState } from 'react';

import { api } from '@/lib/axios';

import type { SelectOption } from './ResourcePage';

interface RemotePickerProps {
  url: string;
  label: (row: any) => string;
  value?: number;
  onChange: (value?: number) => void;
  placeholder?: string;
  width?: number;
  params?: Record<string, unknown>;
}

/** Standalone select that loads its options from a list endpoint (for page toolbars). */
export const RemotePicker = ({
  url,
  label,
  value,
  onChange,
  placeholder,
  width = 240,
  params,
}: RemotePickerProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(url, { params: { limit: 100, ...params } })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data;
        const items: any[] = Array.isArray(data) ? data : (data?.items ?? []);
        setOptions(items.map((row) => ({ value: row.id, label: label(row) })));
      })
      .catch(() => !cancelled && setOptions([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <Select
      showSearch
      allowClear
      loading={loading}
      options={options}
      optionFilterProp="label"
      placeholder={placeholder}
      style={{ width }}
      value={value}
      onChange={(v) => onChange(v ?? undefined)}
    />
  );
};

export default RemotePicker;
