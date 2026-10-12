'use client';

import {
  DownloadOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  RiseOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

// Infer type from LOCALE_KEYS
type LocaleKey = keyof typeof LOCALE_KEYS;

type StatCard = {
  id: string;
  titleKey: LocaleKey;
  value: string;
  valueColor: string;
  titleColor: string;
  subtitleKey?: LocaleKey;
  isButton?: boolean;
  icon: React.ReactNode;
  iconBg: string;
};

const statsData: StatCard[] = [
  {
    id: 's1',
    titleKey: 'GPA',
    value: '3.75',
    valueColor: 'text-blue-600',
    titleColor: 'text-blue-500',
    subtitleKey: 'GPA_SUBTITLE',
    icon: <TrophyOutlined className="text-blue-600 text-2xl" />,
    iconBg: 'bg-blue-100',
  },
  {
    id: 's2',
    titleKey: 'ATTENDANCE',
    value: '95%',
    valueColor: 'text-green-600',
    titleColor: 'text-green-500',
    subtitleKey: 'ATTENDANCE_SUBTITLE',
    icon: <FileDoneOutlined className="text-green-600 text-2xl" />,
    iconBg: 'bg-green-100',
  },
  {
    id: 's3',
    titleKey: 'RANK',
    value: '5/124',
    valueColor: 'text-purple-600',
    titleColor: 'text-purple-500',
    subtitleKey: 'RANK_SUBTITLE',
    icon: <RiseOutlined className="text-purple-600 text-2xl" />,
    iconBg: 'bg-purple-100',
  },
  {
    id: 's4',
    titleKey: 'REPORTS',
    value: '4',
    valueColor: 'text-gray-800',
    titleColor: 'text-gray-600',
    isButton: true,
    icon: <FileProtectOutlined className="text-gray-600 text-2xl" />,
    iconBg: 'bg-gray-200',
  },
];

const HeaderSection = () => {
  const { t } = useLocalization();

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat) => (
        <Card key={stat.id} className="p-4 shadow rounded-lg">
          <div className="flex justify-between items-center flex-wrap gap-2">
            {/* Left side: text info */}
            <div>
              <p className={`text-sm font-medium ${stat.titleColor}`}>
                {t(LOCALE_KEYS[stat.titleKey])}
              </p>
              <h3 className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</h3>
              {stat.subtitleKey && (
                <p className="text-sm text-gray-500">{t(LOCALE_KEYS[stat.subtitleKey])}</p>
              )}
              {stat.isButton && (
                <button className="mt-2 text-blue-600 text-sm ">
                  <div className="flex justify-start items-start">
                    <DownloadOutlined /> {t(LOCALE_KEYS.DOWNLOAD_REPORTS)}
                  </div>
                </button>
              )}
            </div>

            {/* Right side: icon */}
            <div
              className={`ml-4 w-12 h-12 flex items-center justify-center rounded p-2 ${stat.iconBg}`}
            >
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HeaderSection;
