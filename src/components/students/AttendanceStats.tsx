import {
  CalendarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';
import { BiXCircle, BiTrendingUp } from 'react-icons/bi';

export function AttendanceStats({
  totalClasses = 0,
  presentCount = 0,
  lateCount = 0,
  absentCount = 0,
  attendanceRate = 0,
}) {
  const stats = [
    { icon: CalendarOutlined, label: 'Total Classes', value: totalClasses },
    { icon: CheckCircleOutlined, label: 'Present', value: presentCount },
    { icon: BiXCircle, label: 'Absent', value: absentCount },
    { icon: BiTrendingUp, label: 'Attendance Rate', value: `${attendanceRate}%` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.label} className="p-6 border-0">
            <Icon className="text-xl mb-2" />
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </Card>
        );
      })}
    </div>
  );
}
