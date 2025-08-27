import {
  ExperimentOutlined,
  CalculatorOutlined,
  CodeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";

import IconBgColoredCard from "../dashboardui/cards/IconBgColoredCard";
import { useLocalization } from "@/hooks/useLocalization";
import { LOCALE_KEYS } from "@/constants/localizationKeys";

const assignments = [
  {
    title: "Physics Lab Report",
    due: "Tomorrow, 11:59 PM",
    tag: "Urgent",
    color: "#ef4444",
    bgColor: "#fef2f2",
    bgColorIcon: "#fee2e2",
    icon: <ExperimentOutlined style={{ color: "#ef4444" }} />,
  },
  {
    title: "Mathematics Problem Set",
    due: "Aug 27, 2023",
    tag: "Important",
    color: "#f59e0b",
    bgColor:"#fffbeb",
    bgColorIcon: "#fef3c7",
    icon: <CalculatorOutlined style={{ color: "#f59e0b" }} />,
  },
  {
    title: "Computer Science Project",
    due: "Aug 30, 2023",
    tag: "Group Work",
    color: "#5190f7",
    bgColor: "#eff6ff",
    bgColorIcon: "#dbeafe",
    icon: <CodeOutlined style={{ color: "#5190f7" }} />,
  },
  {
    title: "English Essay",
    due: "Sep 2, 2023",
    tag: "Started",
    color: "#10b981",
    bgColor: "#ecfdf5",
    bgColorIcon: "#d1fae5",
    icon: <FileTextOutlined style={{ color: "#10b981" }} />,
  },
];

const UpcomingAssignments = () => {
  const {t} = useLocalization();
  return (
    <Card className="rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">
          {t(LOCALE_KEYS.UPCOMING_ASSIGNMENT)}
        </h2>
        <Button type="text" >
        <span className="text-blue-600 cursor-pointer">
          {t(LOCALE_KEYS.ALL_TASKS)}
        </span>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {assignments.map((a, i) => (
          <IconBgColoredCard
            key={i}
            text={a.title}
            due={a.due}
            tag={a.tag}
            color={a.color}
            bgColor= {a.bgColor}
            bgColorIcon={a.bgColorIcon}
            icon={a.icon}
            rounded="md"
          />
        ))}
      </div>
    </Card>
  );
};

export default UpcomingAssignments;
