import { Card } from "antd";

import ColumnGraph from "../dashboardui/graphs/ColumnGraph";

const data = [
  { week: "Week 1", attendance: 80 },
  { week: "Week 2", attendance: 75 },
  { week: "Week 3", attendance: 90 },
  { week: "Week 4", attendance: 85 },
];

const MonthlyAttendance = () => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <h2 className="text-base font-semibold mb-3">
        Monthly Attendance | الحضور الشهري
      </h2>
      <div style={{ height: 250 }}>
        <ColumnGraph data={data} color="#1F4BCA" />
      </div>
    </Card>
  );
};

export default MonthlyAttendance;
