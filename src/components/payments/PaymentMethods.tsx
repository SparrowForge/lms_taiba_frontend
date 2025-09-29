'use client';
import {Card} from 'antd';
import {FaCcMastercard, FaCcVisa} from 'react-icons/fa';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

type PaymentMethod = {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
  isDefault?: boolean;
};

const paymentMethodsData: PaymentMethod[] = [
  {
    id: 'pm1',
    type: 'visa',
    last4: '4821',
    expiry: '05/25',
    isDefault: true,
  },
  {
    id: 'pm2',
    type: 'mastercard',
    last4: '3274',
    expiry: '11/24',
  },
];

const PaymentMethods = () => {
  const { t } = useLocalization();

  const getIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'visa':
        return <FaCcVisa className="text-blue-600 text-2xl" />;
      case 'mastercard':
        return <FaCcMastercard className="text-red-600 text-2xl" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white shadow rounded-lg p-4">
      <h3 className="font-bold text-xl mb-3">{t(LOCALE_KEYS.PAYMENT_METHODS)}</h3>

      {paymentMethodsData.map((method) => (
        <div
          key={method.id}
          className={`mb-3 p-3 border rounded-md flex justify-between items-center ${
            method.isDefault ? 'border-blue-500' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {getIcon(method.type)}
            <div>
              <p className="font-semibold">
                {method.type.toUpperCase()} ending in {method.last4}
              </p>
              <p className="text-sm text-gray-500">Expires {method.expiry}</p>
            </div>
          </div>
          {method.isDefault && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
              {t(LOCALE_KEYS.DEFAULT)}
            </span>
          )}
        </div>
      ))}

      <button
        className="w-full border border-dashed rounded-md p-2 text-sm font-semibold"
        style={{ color: '#1f4bca' }}
      >
        + {t(LOCALE_KEYS.ADD_PAYMENT_METHODS)}
      </button>
    </Card>
  );
};

export default PaymentMethods;
