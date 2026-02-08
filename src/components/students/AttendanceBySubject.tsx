import { Card, Progress, Empty } from 'antd';

export function AttendanceBySubject({ subjects = [] }) {
  return (
    <Card className="p-6 border-0">
      <h2 className="text-lg font-bold mb-4">Attendance by Subject</h2>

      {!subjects.length ? (
        <Empty description="No subject attendance data" />
      ) : (
        <div className="space-y-6">
          {subjects.map((s) => (
            <div key={s.code}>
              <div className="flex justify-between text-sm">
                <span>{s.code} {s.name}</span>
                <span className={s.attendanceRate < 75 ? 'text-red-500' : 'text-green-600'}>
                  {s.attendanceRate}% ({s.present}/{s.total})
                </span>
              </div>
              <Progress percent={s.attendanceRate} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
