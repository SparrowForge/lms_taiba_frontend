import {Card} from 'antd';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

import ColumnGraph from '../dashboard/dashboardui/graphs/ColumnGraph';

const data = [
  { xdata: 'Web Dev', ydata: 95, color: '#1F4BCA' },
  { xdata: 'Database', ydata: 75, color: '#3fc79a' },
  { xdata: 'UI Design', ydata: 85, color: '#a27cf7' },
];
const AttendenceSummary = () => {
  const { t } = useLocalization();
  return (
    <Card className="rounded-2xl shadow-sm mb-10" style={{ marginBottom: '20px' }}>
      <h2 className="text-base font-semibold mb-3">{t(LOCALE_KEYS.ATTENDANCE_SUMMARTY)}</h2>
      <div style={{ height: 160 }}>
        <ColumnGraph data={data} />
      </div>
    </Card>
  );
};

export default AttendenceSummary;
