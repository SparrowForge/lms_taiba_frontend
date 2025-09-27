'use client';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { ExperimentOutlined, FilePptOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import { FaDownload } from 'react-icons/fa';

type ReceiptType = "pdf" | "lab" | "other";

type Receipt = {
  id: string;
  title: string;
  type?: ReceiptType;
  icon?: React.ReactNode;
};

const receiptsData: Receipt[] = [
  {
    id: 'r1',
    title: 'August Tuition Receipt',
    type: "pdf",
    icon: <FilePptOutlined />,
  },
  {
    id: 'r2',
    title: 'Lab Equipment Fee Receipt',
    type:"lab",
    icon: <ExperimentOutlined />,
  },
  {
    id: 'r3',
    title: 'September Tuition Receipt',
    type: "pdf",
    icon: <FilePptOutlined />,
  },
];

// Define icon colors based on type
const typeColors: Record<ReceiptType, { bg: string; text: string }> = {
  pdf: { bg: 'bg-red-100', text: 'text-red-600' },
  lab: { bg: 'bg-green-100', text: 'text-green-600' },
  other: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const RecentReceipts = () => {
  const { t } = useLocalization();

  return (
    <Card className="bg-white shadow rounded-lg p-4 md:col-span-1">
      <h3 className="font-bold text-xl mb-3">{t(LOCALE_KEYS.RECENT_RECEIPTS)}</h3>
      <ul className="text-sm space-y-2">
        {receiptsData.map((receipt) => {
          const colors = receipt.type ? typeColors[receipt.type] : typeColors.other;

          return (
            <li
              key={receipt.id}
              className="p-2 shadow rounded-md flex justify-between items-center"
            >
              <div className={`flex items-center justify-center w-7 h-7 rounded p-2 ${colors.bg} ${colors.text}`}>
                {receipt.icon || <span className="w-5" />}
              </div>
              <span>{receipt.title}</span>
              <FaDownload className="text-blue-600" />
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default RecentReceipts;
