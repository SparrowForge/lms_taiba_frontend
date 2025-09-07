"use client";

import { Card, Calendar, Tag, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";

import { Status } from "@/enums";
import { useClassSchedules } from "@/hooks/useClassSchedules";
import { useLocalization } from "@/hooks/useLocalization";
import { IClassSchedule } from "@/types/classSchedule";

import ClassScheduleDetailsDrawer from "@/components/classSchedules/ClassScheduleDetailsDrawer";
import { LOCALE_KEYS } from "@/constants/localizationKeys";

const MonthSchedule: React.FC = () => {
  const { t } = useLocalization();
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedDetailsId, setSelectedDetailsId] = useState<number | undefined>();

  const { classSchedules, listStatus, loadClassSchedules } = useClassSchedules();

  useEffect(() => {
    const currentDate = dayjs();
    loadClassSchedules({
      page: 1,
      limit: 100,
      year: currentDate.year(),
      month: currentDate.month() + 1, // API expects 1-12, dayjs uses 0-11
    });
  }, [loadClassSchedules]);

  const handleScheduleClick = (schedule: IClassSchedule) => {
    setSelectedDetailsId(schedule.id);
    setDetailsDrawerVisible(true);
  };

  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, IClassSchedule[]> = {};

    classSchedules.forEach((schedule) => {
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);

      // recurring schedules
      if (schedule.isRecurring && schedule.weekDay?.dayNumber) {
        const monthStart = currentMonth.startOf("month");
        let currentDate = monthStart;

        // find first weekday occurrence
        while (currentDate.day() !== schedule.weekDay.dayNumber % 7) {
          currentDate = currentDate.add(1, "day");
        }

        // add occurrences within range
        while (currentDate.isSame(monthStart, "month")) {
          if (
            (currentDate.isSame(startDate) || currentDate.isAfter(startDate)) &&
            (currentDate.isSame(endDate) || currentDate.isBefore(endDate))
          ) {
            const dateKey = currentDate.format("YYYY-MM-DD");
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(schedule);
          }
          currentDate = currentDate.add(7, "day");
        }
      } else {
        // one-time schedules
        if (startDate.isSame(currentMonth, "month")) {
          const dateKey = startDate.format("YYYY-MM-DD");
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(schedule);
        }
      }
    });

    return grouped;
  }, [classSchedules, currentMonth]);

  const getScheduleColor = (schedule: IClassSchedule): string => {
    if (schedule.status === "ACTIVE") return "green";
    if (schedule.status === "INACTIVE") return "red";
    if (schedule.status === "PENDING") return "orange";

    switch (schedule.classScheduleType) {
      case "REGULAR":
        return "blue";
      case "LAB":
        return "purple";
      case "TUTORIAL":
        return "cyan";
      case "EXAM":
        return "red";
      default:
        return "default";
    }
  };

  // ✅ Custom render for calendar cells
  const dateCellRender = (date: Dayjs) => {
    const dateKey = date.format("YYYY-MM-DD");
    const daySchedules = schedulesByDate[dateKey] || [];

    // ✅ Mark Friday (5) & Saturday (6) as weekend
    const isWeekend = date.day() === 5 || date.day() === 6;

if (daySchedules.length === 0) {
  return isWeekend ? (
    <div
      className="calendar-cell-content flex items-center justify-center"
      style={{ backgroundColor: "#ff4d4f", color: "white", height: "100%", opacity:"0.5"}}
    >
     
    </div>
  ) : null;
}


    return (
      <div
        className={`calendar-cell-content ${isWeekend ? "border border-red-500 rounded" : ""}`}
      >
        {daySchedules.slice(0, 3).map((schedule) => (
          <Tooltip
            key={schedule.id}
            title={`${schedule.subject?.name} - ${schedule.timeSlot?.name} - ${schedule.room?.name}`}
          >
            <Tag
              color={isWeekend ? "red" : getScheduleColor(schedule)} // ✅ override color for weekend
              className="cursor-pointer hover:opacity-80"
              onClick={() => handleScheduleClick(schedule)}
            >
              {schedule.subject?.name?.substring(0, 8)}...
            </Tag>
          </Tooltip>
        ))}
        {daySchedules.length > 3 && (
          <Tag color={isWeekend ? "red" : "default"}>
            +{daySchedules.length - 3} more
          </Tag>
        )}
      </div>
    );
  };

  const handleMonthChange = (date: Dayjs) => {
    setCurrentMonth(date);
    loadClassSchedules({
      page: 1,
      limit: 100,
      year: date.year(),
      month: date.month() + 1,
    });
  };

  return (
    <div
      className="flex flex-col gap-[12px] overflow-y-auto"
      style={{ height: "calc(100vh - 142px)" }}
    >
      <Card>
        {listStatus.status === Status.LOADING ? (
          <div className="flex items-center justify-center p-8 text-gray-500">
            {t(LOCALE_KEYS.LOADING)}
          </div>
        ) : listStatus.status === Status.FAILED ? (
          <div className="flex items-center justify-center p-8 text-red-500">
            {t(LOCALE_KEYS.ERROR)}: {listStatus.message}
          </div>
        ) : (
          <Calendar
            value={currentMonth}
            cellRender={dateCellRender}
            onChange={handleMonthChange}
            mode="month"
            fullscreen
          />
        )}
      </Card>

      {/* ✅ Details Drawer */}
      <ClassScheduleDetailsDrawer
        visible={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
        onEdit={() => {}}
        classScheduleId={selectedDetailsId}
      />
    </div>
  );
};

export default MonthSchedule;
