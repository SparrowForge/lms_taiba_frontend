import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";
import { Card, Progress, Button } from "antd";
import { useLocale } from "next-intl";

const subjects = [
  { name: "Mathematics", local_name: "الرياضيات", percent: 86 },
  { name: "Physics", local_name: "الفيزياء", percent: 92 },
  { name: "Computer Science", local_name: "علوم الحاسوب", percent: 78 },
  { name: "English", local_name: "اللغة الإنجليزية", percent: 95 },
  { name: "History", local_name: "التاريخ", percent: 81 },
  { name: "Biology", local_name: "الأحياء", percent: 88 },
];

const AcademicProgress = () => {
  const { t } = useLocalization();
  const locale = useLocale();

  return (
    <Card className="rounded-2xl shadow-sm min-h-full">
      {/* Header */}
     <div className="flex items-center justify-between mb-2">
  <h2 className="text-lg font-semibold">
    {t(LOCALE_KEYS.ACADEMIC_PROGRESS)}
  </h2>
  <Button type="text"  style={{padding:0}}>
    <span className="text-blue-600 cursor-pointer">
      {t(LOCALE_KEYS.VIEW_ALL)}
    </span>
  </Button>
</div>


      {/* Subjects */}
      {subjects.map((sub, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <h1>
              {locale === "ar" ? sub.local_name : sub.name}
            </h1>
            <p>{sub.percent}%</p>
          </div>
          <Progress
            percent={sub.percent}
            showInfo={false}
            strokeColor="#1F4BCA"
          />
        </div>
      ))}
    </Card>
  );
};

export default AcademicProgress;
