"use client";

import {
  CalculatorOutlined,
  CodeOutlined,
  ExperimentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";
import dayjs from "dayjs";

import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";
import { useCourseAssignments } from "@/hooks/useCourseAssignments";
import IconBgColoredCard from "../dashboardui/cards/IconBgColoredCard";
import { useEffect } from "react";

const getAssignmentStyle = (assignment: any) => {
  // 🔹 Assign icon & color based on type
  switch (assignment.type?.toLowerCase()) {
    case "lab":
      return {
        color: "#ef4444",
        bgColor: "#fef2f2",
        bgColorIcon: "#fee2e2",
        icon: <ExperimentOutlined style={{ color: "#ef4444" }} />,
      };
    case "math":
      return {
        color: "#f59e0b",
        bgColor: "#fffbeb",
        bgColorIcon: "#fef3c7",
        icon: <CalculatorOutlined style={{ color: "#f59e0b" }} />,
      };
    case "project":
      return {
        color: "#5190f7",
        bgColor: "#eff6ff",
        bgColorIcon: "#dbeafe",
        icon: <CodeOutlined style={{ color: "#5190f7" }} />,
      };
    case "essay":
      return {
        color: "#6b7280",
        bgColor: "#f3f4f6",
        bgColorIcon: "#e5e7eb",

        icon: <FileTextOutlined style={{ color: "#6b7280" }} />,
      };
    default:
      return {
        color: "#10b981",
        bgColor: "#ecfdf5",
        bgColorIcon: "#d1fae5",
        icon: <FileTextOutlined style={{ color: "#10b981" }} />,
      };
  }
};

const UpcomingAssignments = () => {
  const { t } = useLocalization();
  const { courseAssignments, listStatus, loadCourseAssignments } =
    useCourseAssignments();

  // 🔹 Load assignments once
  useEffect(() => {
    loadCourseAssignments({ page: 1, limit: 100 });
  }, [loadCourseAssignments]);

  // 🔹 Sort: urgent (due soon) first
  const sortedAssignments = [...(courseAssignments || [])].sort((a, b) => {
    const dueA = dayjs(a.dueDate);
    const dueB = dayjs(b.dueDate);

    const isUrgentA = dueA.diff(dayjs(), "day") <= 1; // due today/tomorrow
    const isUrgentB = dueB.diff(dayjs(), "day") <= 1;

    if (isUrgentA && !isUrgentB) return -1;
    if (!isUrgentA && isUrgentB) return 1;

    return dueA.valueOf() - dueB.valueOf();
  });

  return (
    <Card className="rounded-2xl shadow-sm min-h-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">
          {t(LOCALE_KEYS.UPCOMING_ASSIGNMENT)}
        </h2>
        <Button type="text" style={{ padding: 0 }}>
          <span className="text-blue-600 cursor-pointer">
            {t(LOCALE_KEYS.ALL_TASKS)}
          </span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto h-[500px] mb-">
        {sortedAssignments.map((a: any, i: number) => {
          const style = getAssignmentStyle(a);

          const isUrgent = dayjs(a.dueDate).diff(dayjs(), "day") <= 1;

          return (
            <IconBgColoredCard
              key={i}
              text={a.title}
              due={dayjs(a.dueDate).format("MMM D, YYYY")}
              tag={isUrgent ? "Due Soon" : a.tag || ""}
              color={isUrgent ? "#ef4444" : style.color}
              bgColor={isUrgent ? "#fef2f2" : style.bgColor}
              bgColorIcon={isUrgent ? "#fee2e2" : style.bgColorIcon}
              icon={
                isUrgent ? (
                  <FileTextOutlined style={{ color: "#ef4444" }} />
                ) : (
                  style.icon
                )
              }
              rounded="md"
            />
          );
        })}
      </div>
    </Card>
  );
};

export default UpcomingAssignments;
