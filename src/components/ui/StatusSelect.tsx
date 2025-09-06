'use client';

import {Form, Select} from 'antd';
import {useTranslations} from 'next-intl';
import React from 'react';

import {LOCALE_KEYS, t} from '@/constants/localizationKeys';

import {IStatusSelectProps} from '@/types/statusSelect';

export const StatusSelect: React.FC<IStatusSelectProps> = ({
  value,
  onChange,
  allowClear,
  disabled,
  placeholder,
  size = 'middle',
  style,
  options,
}) => {
  const t = useTranslations();

  // Convert to Ant Design Select options with localized labels
  const selectOptions = options.map((option) => ({
    label: t(option.labelKey, { defaultValue: option.value }),
    value: option.value,
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
      options={selectOptions}
      size={size}
      style={style}
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export function StatusSelectFormItem({ options, initialValue }: IStatusSelectProps) {
  return (
    <Form.Item
      initialValue={initialValue ?? options[0]?.value}
      name="status"
      label={t(LOCALE_KEYS.STATUS)}
      rules={[
        {
          required: true,
          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STATUS) }),
        },
      ]}
    >
      <StatusSelect options={options} />
    </Form.Item>
  );
}
