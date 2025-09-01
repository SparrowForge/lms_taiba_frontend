"use client";

import { Card, Tag, Segmented, Row, Col } from "antd";
import { useState } from "react";

import MonthSchedule from "./MonthSchedule";
import TodaysClasses from "./TodaysClasses";
import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";

const WeeklySchedule: React.FC = () => {

  const { t } = useLocalization();

  const weekDays = [
    { key: "Sun", label: t(LOCALE_KEYS.SUN), classes: [] },
    {
      key: "Mon",
      label: t(LOCALE_KEYS.MON),
      classes: [
        { title: "Programming", time: "9:30 - 11:00", color: "blue" },
        { title: "Database", time: "12:30 - 2:00", color: "green" },
      ],
    },
    {
      key: "Tue",
      label: t(LOCALE_KEYS.TUE),
      classes: [
        { title: "Web-dev", time: "11:30 - 1:00", color: "geekblue" },
        { title: "UI-design", time: "2:30 - 4:00", color: "cyan" },
      ],
    },
    {
      key: "Wed",
      label: t(LOCALE_KEYS.WED),
      classes: [
        { title: "Data Science", time: "10:00 - 11:30", color: "purple" },
      ],
    },
    {
      key: "Thu",
      label: t(LOCALE_KEYS.THU),
      classes: [{ title: "Python", time: "9:00 - 10:30", color: "green" }],
    },
  ];

  const [view, setView] = useState<"Week" | "Month">("Week");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <Card className="shadow-md rounded-xl min-h-[103vh]">
      {/* Header */}
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <h3 className="font-semibold text-lg">
            {t(LOCALE_KEYS.WEEKLY_SCHEDULE_TITLE)}
          </h3>
        </Col>
        <Col>
       <Segmented
  className="weekly-segmented"
  shape="round"
  style={{ background: "#ffffff", color: "#2546b2" }}
  options={[t(LOCALE_KEYS.VIEW_WEEK), t(LOCALE_KEYS.VIEW_MONTH)]}
  value={view === "Week" ? t(LOCALE_KEYS.VIEW_WEEK) : t(LOCALE_KEYS.VIEW_MONTH)}
  onChange={(val) =>
    setView(val === t(LOCALE_KEYS.VIEW_WEEK) ? "Week" : "Month")
  }
/>

        </Col>
      </Row>

      {/* Switch Views */}
      {view === "Week" ? (
        <>
          <Row gutter={8} justify="start" className="mb-4">
            {weekDays.map((day) => (
              <Col key={day.key} flex="1">
                <div
                  className={`text-center rounded-lg min-h-[80px] ${selectedDate && day.label.startsWith(selectedDate)
                      ? "bg-yellow-50 border border-yellow-300"
                      : ""
                    }`}
                >
                  <div className="font-medium mb-2 bg-[#f9fafb] p-4 rounded-lg">
                    {day.label}
                  </div>
                  {day.classes.length === 0 ? (
                    <span
                      className="text-gray-400 text-xs"
                      style={{ marginTop: "4px" }}
                    >
                      No Class <br />
                      Weekend
                    </span>
                  ) : (
                    day.classes.map((cls, idx) => (
                      <Tag
                        key={idx}
                        color={cls.color}
                        style={{
                          borderRadius: "6px",
                          borderLeft: `3px solid ${cls.color}`,
                          borderTop: "none",
                          borderRight: "none",
                          borderBottom: "none",
                          marginBottom: "4px",
                          width: "100%",
                          padding: "4px",
                        }}
                        className="block rounded-lg px-2 py-1 text-xs"
                      >
                        <div className="font-medium">{cls.title}</div>
                        <div>{cls.time}</div>
                      </Tag>
                    ))
                  )}
                </div>
              </Col>
            ))}
          </Row>
          <TodaysClasses />
        </>
      ) : (
        <MonthSchedule
          onSelectClass={(date) => {
            setSelectedDate(date);
            setView("Week"); // switch to week view
          }}
        />
      )}
    </Card>
  );
};

export default WeeklySchedule;
