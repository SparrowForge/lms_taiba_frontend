"use client";
import { Card } from "antd";

import AreaGraph from "../dashboardui/graphs/AreaGraph";
import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";


interface PerformanceData {
  week: string;
  score: number;
}
const StudentPerformance: React.FC = () => {
    const {t} = useLocalization();
    const data: PerformanceData[] = [
        { week: "Week 1", score: 75 },
        { week: "Week 2", score: 80 },
        { week: "Week 3", score: 78 },
        { week: "Week 4", score: 82 },
        { week: "Week 5", score: 85 },
    ];

  

    return (
        <Card className="shadow-md rounded-xl ">
            <h3 className="font-semibold text-lg mb-2">
                  {t(LOCALE_KEYS.STUDENT_PERFORMANCE)}
               
            </h3>
          <AreaGraph data = {data}/>
        </Card>
    );
};

export default StudentPerformance;
