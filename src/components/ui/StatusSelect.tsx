'use client';

import {Select} from 'antd';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

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
  const { t } = useLocalization();
  const presetValues: Record<Exclude<StatusPreset, 'custom'>, StatusOptionValue[]> = {
    binary: ['active', 'inactive'],
    lifecycle: ['active', 'inactive', 'ongoing', 'complete', 'archived'],
  };

  const values: StatusOptionValue[] = (
    preset === 'custom' ? (options ?? []) : presetValues[preset]
  ) as StatusOptionValue[];

  const localizedOptions = values.map((val) => ({
    label: t(LOCALE_KEYS[val as keyof typeof LOCALE_KEYS]),
    value: val as StatusOptionValue,
  }));

  return (
    <Select
      showSearch
      value={value ?? undefined}
      onChange={onChange as (val: string) => void}
      allowClear={allowClear}
      disabled={disabled}
      placeholder={placeholder ?? t(LOCALE_KEYS.PLEASE_SELECT_STATUS)}
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
