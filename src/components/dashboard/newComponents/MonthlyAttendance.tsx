import { Card } from 'antd';
import { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useAttendances } from '@/hooks/useAttendances';
import { useAuth } from '@/hooks/useAuth';
import { useLocalization } from '@/hooks/useLocalization';

import ColumnGraph from '../dashboardui/graphs/ColumnGraph';

const data = [
  { xdata: 'Week 1', ydata: 80, color: '#1d4bce' },
  { xdata: 'Week 2', ydata: 75, color: '#1d4bce' },
  { xdata: 'Week 3', ydata: 90, color: '#1d4bce' },
  { xdata: 'Week 4', ydata: 85, color: '#1d4bce' },
];

const MonthlyAttendance = () => {
  const { t } = useLocalization();
  const {loadAttendanceStudent} = useAttendances()
  const {user} = useAuth()

  useEffect(()=>{
    if(user?.student?.id){
      loadAttendanceStudent(user?.student?.id)
    }
  },[loadAttendanceStudent, user?.student?.id])
  return (
    <Card className="rounded-2xl shadow-sm">
      <h2 className="text-base font-semibold mb-3">{t(LOCALE_KEYS.MONTHLY_ATTENDANCE)}</h2>
      <div style={{ height: 160 }}>
        <ColumnGraph data={data} />
      </div>
    </Card>
  );
};

export default MonthlyAttendance;
