'use client';

import { Card } from 'antd';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import ColumnGraph from '../dashboard/dashboardui/graphs/ColumnGraph';

const data = [
  { xdata: 'Web Dev', ydata: 95, color: '#1F4BCA' },
  { xdata: 'Data Science', ydata: 65, color: '#1F4BCA' },
  { xdata: 'UI/UX', ydata: 79, color: '#1F4BCA' },
];
const StudentProgress = () => {
  const { t } = useLocalization();
  return (
    <Card className="rounded-2xl shadow-sm mb-10" style={{ marginBottom: '20px' }}>
      <h2 className="text-base font-semibold mb-3">{t(LOCALE_KEYS.STUDENT_PROGRESS)}</h2>
      <div style={{ height: 160 }}>
        {/* <ColumnGraph data={data} /> */}
      </div>
    </Card>
  );
};

export default StudentProgress;
