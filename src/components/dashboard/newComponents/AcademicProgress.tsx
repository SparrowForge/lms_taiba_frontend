import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";
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
  const {t} = useLocalization();
  return (
    <Card className="rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">  {t(LOCALE_KEYS.ACADEMIC_PROGRESS)}</h2>
       <Button type="text" >
        <span className="text-blue-600 cursor-pointer">{t(LOCALE_KEYS.VIEW_ALL)}</span>
        </Button>
      </div>
      {subjects.map((sub, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <h1>{sub.name}</h1>
            <p>{sub.percent}%</p>
          </div>
          <Progress percent={sub.percent} showInfo={false} strokeColor="#1F4BCA" />
        </div>
      ))}
    </Card>
  );
};

export default AcademicProgress;
