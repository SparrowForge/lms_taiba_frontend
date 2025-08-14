'use client';

import {Select} from 'antd';
import {useTranslations} from 'next-intl';
import React from 'react';

export type StatusOptionValue = 'active' | 'inactive' | 'complete' | 'archived' | 'ongoing';

type StatusPreset = 'binary' | 'lifecycle' | 'custom';

interface StatusSelectProps {
  value?: StatusOptionValue | null;
  onChange?: (value: StatusOptionValue) => void;
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
  preset?: StatusPreset;
  options?: StatusOptionValue[]; // used when preset = 'custom'
}

const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  allowClear,
  disabled,
  placeholder,
  size = 'middle',
  style,
  preset = 'binary',
  options,
}) => {
  const t = useTranslations();
  const presetValues: Record<Exclude<StatusPreset, 'custom'>, StatusOptionValue[]> = {
    binary: ['active', 'inactive'],
    lifecycle: ['active', 'inactive', 'ongoing', 'complete', 'archived'],
  };

  const values: StatusOptionValue[] = (
    preset === 'custom' ? (options ?? []) : presetValues[preset]
  ) as StatusOptionValue[];

  const localizedOptions = values.map((val) => ({
    label: t(val),
    value: val,
  }));

  return (
    <Select
      showSearch
      value={value ?? undefined}
      onChange={onChange as (val: string) => void}
      allowClear={allowClear}
      disabled={disabled}
      placeholder={placeholder ?? t('please_select_status')}
      optionFilterProp="label"
      options={localizedOptions}
      size={size}
      style={style}
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export default StatusSelect;
