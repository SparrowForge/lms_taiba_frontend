import { Form, Select } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

interface PaymentTypeSelectorProps {
  disabled?: boolean;
}

const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({ disabled = false }) => {
  const { t } = useLocalization();

  return (
    <Form.Item
      name="paymentType"
      label={t(LOCALE_KEYS.PAYMENT_TYPE)}
      rules={[
        {
          required: true,
          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PAYMENT_TYPE) }),
        },
      ]}
    >
      <Select placeholder={t(LOCALE_KEYS.SELECT_PAYMENT_TYPE)} disabled={disabled}>
        <Select.Option value="one_time">{t(LOCALE_KEYS.ONE_TIME)}</Select.Option>
        <Select.Option value="installment">{t(LOCALE_KEYS.INSTALLMENT)}</Select.Option>
        <Select.Option value="monthly">{t(LOCALE_KEYS.MONTHLY)}</Select.Option>
      </Select>
    </Form.Item>
  );
};

export default PaymentTypeSelector;
