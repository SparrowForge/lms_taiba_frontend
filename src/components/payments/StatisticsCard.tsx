'use client';
import {CreditCardOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {useLocale} from 'next-intl';
import React from 'react';
import {FaHistory} from 'react-icons/fa';

type StatCard = {
  title: string;
  localTitle: string;
  amount: string;
  subtitle: string;
  button: {
    label: string;
    localLabel: string;
    icon: React.ReactNode;
    type?: 'primary' | 'link';
  };
};

const stats: StatCard[] = [
  {
    title: 'Total Due',
    localTitle: 'الإجمالي المستحق',
    amount: 'SAR 4,500',
    subtitle: 'Due by August 30, 2023',
    button: {
      label: 'Pay All Now',
      localLabel: 'دفع الكل الآن',
      icon: <CreditCardOutlined />,
      type: 'primary',
    },
  },
  {
    title: 'Balance History',
    localTitle: 'تاريخ الرصيد',
    amount: 'SAR 24,500',
    subtitle: 'Total paid this academic year',
    button: {
      label: 'Payment History',
      localLabel: 'تاريخ المدفوعات',
      icon: <FaHistory />,
      type: 'link',
    },
  },
  {
    title: 'Upcoming Fees',
    localTitle: 'الرسوم القادمة',
    amount: 'SAR 4,500',
    subtitle: 'October Tuition (due Sep 30)',
    button: {
      label: 'Fee Schedule',
      localLabel: 'جدول الرسوم',
      icon: <InfoCircleOutlined />,
      type: 'link',
    },
  },
];

const StatisticsCard = () => {
  const locale = useLocale();

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      {stats.map((item, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-4 flex flex-col">
          {/* Title */}
          <p className="text-gray-500 text-[12px]">
            {locale === 'ar' ? item.localTitle : item.title}
          </p>

          {/* Amount */}
          <h3 className="text-xl font-extrabold">{item.amount}</h3>

          {/* Subtitle */}
          <p
            className={`text-sm ${
              item.button.type === 'primary' ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {item.subtitle}
          </p>

          {/* Button */}
          <button
            className={`mt-2 py-1 rounded-md text-sm flex items-center gap-1`}
            style={{ color: '#1f4bca' }}
          >
            {item.button.icon}
            {locale === 'ar' ? item.button.localLabel : item.button.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCard;
