"use client";

import { Calendar, Tag } from "antd";
import type { Dayjs } from "dayjs";

const monthlyClasses: Record<string, { title: string; time: string; color: string }[]> = {
    "2025-08-25": [
        { title: "Programming", time: "9:30 - 11:00", color: "blue" },
        { title: "Database", time: "12:30 - 2:00", color: "green" },
    ],
    "2025-08-26": [
        { title: "Web Dev", time: "11:30 - 1:00", color: "geekblue" },
        { title: "UI Design", time: "2:30 - 4:00", color: "cyan" },
    ],
    "2025-08-27": [{ title: "Data Science", time: "10:00 - 11:30", color: "purple" }],
    "2025-08-28": [{ title: "Python", time: "9:00 - 10:30", color: "green" }],
    "2025-09-01": [
        { title: "Web Dev", time: "11:30 - 1:00", color: "geekblue" },
        { title: "UI Design", time: "2:30 - 4:00", color: "cyan" },
    ],
};

interface MonthScheduleProps {
    onSelectClass: (date: string) => void;
}

const MonthSchedule: React.FC<MonthScheduleProps> = ({ onSelectClass }) => {
    const cellRender = (date: Dayjs, info: {
        originNode: any; type: string
    }) => {
        if (info.type === "date") {
            const key = date.format("YYYY-MM-DD");
            const classes = monthlyClasses[key] || [];
            return (
                <ul className="m-0 p-0 list-none">
                    {classes.map((cls, idx) => (
                        <Tag
                            color={cls.color}
                            key={idx}
                            className="mb-1 text-xs cursor-pointer "
                            onClick={() => onSelectClass(key)}
                        >
                            {cls.title.length > 5 ? cls.title.slice(0, 6) + "" : cls.title}
                        </Tag>
                    ))}
                </ul>
            );
        }
        return info.originNode;
    };

    return <Calendar fullscreen={true} cellRender={cellRender} />;
};

export default MonthSchedule;
