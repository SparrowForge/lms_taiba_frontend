"use client";

import { Area } from "@ant-design/plots";
import { Card } from "antd";

const StudentPerformance: React.FC = () => {
    const data = [
        { week: "Week 1", score: 75 },
        { week: "Week 2", score: 80 },
        { week: "Week 3", score: 78 },
        { week: "Week 4", score: 82 },
        { week: "Week 5", score: 85 },
    ];

    const config = {
        data,
        xField: "week",
        yField: "score",
        height: 200,
        shapeField: "smooth", // smooth line like your Line chart
        style: {
            fill: "l(270) 0:#ffffff 1:#3b82f6", // gradient (white → blue)
        },
        axis: {
            y: {
                nice: false,
                min: 0,
                max: 100,
                tickInterval: 10,
                labelFormatter: (val: number) => `${val}`,
            },
        },
        line: {
            style: {
                stroke: "#3b82f6",
                strokeWidth: 2,
            },
        },
        point: {
            size: 4,
            shape: "circle",
            style: {
                fill: "#3b82f6",
                stroke: "#fff",
                lineWidth: 1,
            },
        },
        tooltip: {
            showMarkers: true,
        },
    };

    return (
        <Card className="shadow-md rounded-xl ">
            <h3 className="font-semibold text-md mb-2">
                Student Performance <span className="ml-2">|</span>{" "}
                <span className="font-normal">أداء الطلاب</span>
            </h3>
            <Area {...config} />
        </Card>
    );
};

export default StudentPerformance;
