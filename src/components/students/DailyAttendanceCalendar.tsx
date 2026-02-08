import { Card, Empty } from 'antd';
import dayjs from 'dayjs';

export function DailyAttendanceCalendar({
  month,
  year,
  attendances = [],
}) {
  if (!attendances.length) {
    return (
      <Card className="p-6 border-0">
        <Empty description="No daily attendance data" />
      </Card>
    );
  }

  const map = new Map(attendances.map((a) => [a.date, a.count]));
  const firstDay = dayjs(`${year}-${month}-01`);
  const daysInMonth = firstDay.daysInMonth();
  const offset = firstDay.day();

  return (
    <Card className="p-6 border-0">
      <h2 className="text-lg font-bold mb-4">
        Daily Attendance – {month} {year}
      </h2>

      <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold mb-3">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: offset + daysInMonth }).map((_, i) => {
          const day = i - offset + 1;
          if (day <= 0) return <div key={i} />;

          const date = firstDay.date(day).format('YYYY-MM-DD');
          const count = map.get(date);

          return (
            <div
              key={i}
              className={`rounded-lg p-3 text-center ${
                count ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <p className="font-semibold">{day}</p>
              {count && <p className="text-xs">{count} class</p>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
