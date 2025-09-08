"use client";

import { Card, Col, Row, Segmented, Tag } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";

import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useClassSchedules } from "@/hooks/useClassSchedules";
import { useLocalization } from "@/hooks/useLocalization";

import { IClassSchedule } from "@/types/classSchedule";
import TodaysClasses from "./TodaysClasses";
import MonthSchedule from "./MonthSchedule";
import ClassScheduleDetailsDrawer from "@/components/classSchedules/ClassScheduleDetailsDrawer";

const WEEKDAY_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
dayjs.extend(isBetween);

interface WeekDayState {
  key: string;
  label: string;
  classes: IClassSchedule[];
}

const WeeklySchedule: React.FC = () => {
  const { t } = useLocalization();
  const { classSchedules, loadClassSchedules } = useClassSchedules();

  const [view, setView] = useState<"Week" | "Month">("Week");

  const [weekDays, setWeekDays] = useState<WeekDayState[]>(
    WEEKDAY_ORDER.map((day) => ({
      key: day,
      label: t((LOCALE_KEYS as any)[day.toUpperCase().slice(0, 3)]),
      classes: [],
    }))
  );

  // 🔹 state for details drawer
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  useEffect(() => {
    loadClassSchedules({ page: 1, limit: 100 });
  }, [loadClassSchedules]);

  useEffect(() => {
    if (!classSchedules || classSchedules.length === 0) return;

    const updatedWeekDays: WeekDayState[] = WEEKDAY_ORDER.map((day) => {
      const classesForDay = classSchedules.filter((schedule) => {
        if (!schedule.weekDay) return false;

        const isSameDay = schedule.weekDay.name.toLowerCase() === day.toLowerCase();
        if (!isSameDay) return false;

        const startDate = dayjs(schedule.startDate);
        const endDate = dayjs(schedule.endDate);
        const isWithinRange = dayjs().isBetween(startDate, endDate, "day", "[]");

        return isWithinRange;
      });

      return {
        key: day,
        label: t((LOCALE_KEYS as any)[day.toUpperCase().slice(0, 3)]),
        classes: classesForDay,
      };
    });

    setWeekDays(updatedWeekDays);
  }, [classSchedules]);

const getScheduleColor = (subject: IClassSchedule) => {
  const capacity = subject.maxCapacity ?? 0;

  if (capacity < 10) {
    return "yellow";
  } else if (capacity >= 10 && capacity < 30) {
    return "red";
  } else if (capacity >= 30 && capacity < 50) {
    return "purple";
  } else if (capacity >= 50 && capacity < 70) {
    return "cyan";
  } else if (capacity >= 70 && capacity < 100) {
    return "blue";
  } else if (capacity >= 100 && capacity < 200) {
    return "orange";
  } else if (capacity >= 200) {
    return "green";
  } else {
    return "default";
  }
};



  // 🔹 open details drawer
  const handleOpenDetails = (schedule: IClassSchedule) => {
    setSelectedDetailsId(schedule.id);
    setDetailsDrawerVisible(true);
  };

  return (
    <Card className="shadow-md rounded-xl min-h-[103vh]">
      {/* Header */}
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <h3 className="font-semibold text-lg">{t(LOCALE_KEYS.WEEKLY_SCHEDULE_TITLE)}</h3>
        </Col>
        <Col>
          <Segmented
            options={["Week", "Month"]}
            value={view}
            onChange={(val) => setView(val as "Week" | "Month")}
          />
        </Col>
      </Row>

      {/* Weekly View */}
      {view === "Week" ? (
        <>
          <Row gutter={8} justify="start" className="mb-4">
            {weekDays.map((day) => (
              <Col key={day.key} flex="1">
                <div className="text-center rounded-lg min-h-[80px]">
                  <div className="font-medium mb-2 bg-[#f9fafb] p-4 rounded-lg">
                    {day.label}
                  </div>
                  <div className="flex flex-col gap-2">
                    {day.classes.length > 0 ? (
                      day.classes.map((cls, idx) => (
                        <Tag
                          key={idx}
                          color={getScheduleColor(cls)}
                          style={{
                            borderRadius: "6px",
                            borderLeft: `3px solid ${getScheduleColor(cls)}`,
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenDetails(cls)}
                        >
                          <div className="font-medium">
                            {cls.subject?.name || cls.faculty?.fullName || "No Subject"}
                          </div>
                          <div>{cls.timeSlot?.name || "No Time"}</div>
                          <div className="text-xs">{cls.room?.name || ""}</div>
                        </Tag>
                      ))
                    ) : (
                      <div className="text-gray-400 text-xs">No Classes</div>
                    )}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <TodaysClasses />
        </>
      ) : (
        // 🔹 Pass handleOpenDetails into MonthSchedule
        <MonthSchedule />
      )}

      {/* 🔹 Shared Details Drawer */}
      <ClassScheduleDetailsDrawer
        visible={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={() => {}}
        classScheduleId={selectedDetailsId}
      />
    </Card>
  );
};

export default WeeklySchedule;
