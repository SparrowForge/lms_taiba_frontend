import { Card, Progress, Button } from "antd";

const subjects = [
  { name: "Mathematics | الرياضيات", percent: 86 },
  { name: "Physics | الفيزياء", percent: 92 },
  { name: "Computer Science | علوم الحاسوب", percent: 78 },
  { name: "English | اللغة الإنجليزية", percent: 95 },
  { name: "History | التاريخ", percent: 81 },
  { name: "Biology | الأحياء", percent: 88 },
];

const AcademicProgress = () => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">Academic Progress | التقدم الأكاديمي</h2>
        <Button type="text" className="text-blue-600 font-medium">View All | عرض الكل</Button>
      </div>
      {subjects.map((sub, index) => (
        <div key={index} className="mb-3">
          <p className="text-sm font-medium mb-1">{sub.name}</p>
          <Progress percent={sub.percent} showInfo={false} strokeColor="#1F4BCA" />
        </div>
      ))}
    </Card>
  );
};

export default AcademicProgress;
