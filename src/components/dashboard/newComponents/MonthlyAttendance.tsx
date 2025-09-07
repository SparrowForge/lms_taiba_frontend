import {Card} from 'antd';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import { useLocalization } from "@/hooks/useLocalization";
import ColumnGraph from '../dashboardui/graphs/ColumnGraph';



const data = [
  { xdata: "Week 1", ydata: 80 },
  { xdata: "Week 2", ydata: 75 },
  { xdata: "Week 3", ydata: 90 },
  { xdata: "Week 4", ydata: 85 },
];

const MonthlyAttendance = () => {
  const { t } = useLocalization();
  return (
    <Card className="rounded-2xl shadow-sm">
      <h2 className="text-base font-semibold mb-3">{t(LOCALE_KEYS.MONTHLY_ATTENDANCE)}</h2>
      <div style={{ height: 160 }}>
        <ColumnGraph data={data} color="#1F4BCA" />
      </div>
    </Card>
  );
};

export default MonthlyAttendance;
