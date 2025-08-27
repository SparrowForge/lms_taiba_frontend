"use client";
import { Card } from "antd";

import AreaGraph from "../dashboardui/graphs/AreaGraph";


interface PerformanceData {
  week: string;
  score: number;
}
const StudentPerformance: React.FC = () => {
    const data: PerformanceData[] = [
        { week: "Week 1", score: 75 },
        { week: "Week 2", score: 80 },
        { week: "Week 3", score: 78 },
        { week: "Week 4", score: 82 },
        { week: "Week 5", score: 85 },
    ];

  

    return (
        <Card className="shadow-md rounded-xl ">
            <h3 className="font-semibold text-md mb-2">
                Student Performance <span className="ml-2">|</span>{" "}
                <span className="font-normal">أداء الطلاب</span>
            </h3>
          <AreaGraph data = {data}/>
        </Card>
    );
};

export default StudentPerformance;
