'use client';
import {DownloadOutlined} from '@ant-design/icons';
import {Card} from 'antd';
import React from 'react';
import {AiFillCheckCircle, AiOutlineCloseCircle} from 'react-icons/ai';
import {MdOutlinePayment} from 'react-icons/md';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';


type Invoice = {
  id: string;
  title: string;
  date: string;
  amount: string;
  status: {
    value: 'paid' | 'unpaid';
    label: { en: string; ar: string };
  };
};

const invoices: Invoice[] = [
  {
    id: 'INV-2023-09',
    title: 'September Tuition',
    date: 'Aug 15, 2023',
    amount: 'SAR 4,500',
    status: {
      value: 'unpaid',
      label: {
        en: 'Unpaid',
        ar: 'غير مدفوع',
      },
    },
  },
  {
    id: 'INV-2023-08',
    title: 'August Tuition',
    date: 'Jul 15, 2023',
    amount: 'SAR 4,500',
    status: {
      value: 'paid',
      label: {
        en: 'Paid',
        ar: 'مدفوع',
      },
    },
  },
  {
    id: 'INV-2023-07',
    title: 'Lab Equipment Fee',
    date: 'Jun 30, 2023',
    amount: 'SAR 1,200',
    status: {
      value: 'paid',
      label: {
        en: 'Paid',
        ar: 'مدفوع',
      },
    },
  },
];

const currentLang: 'en' | 'ar' = 'en';

const RecentInvoices = () => {
  const { t } = useLocalization();
  return (
    <Card className="h-screen overflow-hidden rounded-lg md:col-span-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-700 text-xl">{t(LOCALE_KEYS.RECENT_INVOICES)}</h3>
        <div className="flex gap-2">
          <button className="bg-gray-100 px-3 py-1 rounded-md text-sm">
            {t(LOCALE_KEYS.FILTER)}
          </button>
          <button
            className="bg-blue-600 px-3 py-1 rounded-md text-sm flex items-center gap-1"
            style={{ color: '#ffffff' }}
          >
            <DownloadOutlined /> {t(LOCALE_KEYS.DOWNLOAD_ALL)}
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm">
            <th className="p-2">#</th>
            <th className="p-2">{t(LOCALE_KEYS.INVOICE)}</th>
            <th className="p-2">{t(LOCALE_KEYS.DATE)}</th>
            <th className="p-2">{t(LOCALE_KEYS.AMOUNT)}</th>
            <th className="p-2">{t(LOCALE_KEYS.STATUS)}</th>
            <th className="p-2">{t(LOCALE_KEYS.ACTION)}</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t">
              <td className="p-2">{invoice.id}</td>
              <td className="p-2">{invoice.title}</td>
              <td className="p-2">{invoice.date}</td>
              <td className="p-2">{invoice.amount}</td>
              <td
                className={`p-2  ${
                  invoice.status.value === 'paid' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {invoice.status.value === 'paid' ? (
                  <div className="flex items-center gap-1">
                    <AiFillCheckCircle /> {invoice.status.label[currentLang]}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <AiOutlineCloseCircle /> {invoice.status.label[currentLang]}
                  </div>
                )}
              </td>
              <td className="p-2 flex items-center gap-2" style={{ color: '#1f4bca' }}>
                <button>
                  <DownloadOutlined size={16} />
                </button>
                <button>
                  <MdOutlinePayment size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default RecentInvoices;
