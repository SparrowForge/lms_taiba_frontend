"use client";
import { Card, Col, Row, Tag } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useMemo } from "react";

import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";
import { useClassSchedules } from "@/hooks/useClassSchedules";

dayjs.extend(isBetween);

const TodaysClasses = () => {
  const { t } = useLocalization();
  const { classSchedules, loadClassSchedules } = useClassSchedules();

  useEffect(() => {
    loadClassSchedules({ page: 1, limit: 100 });
  }, [loadClassSchedules]);

  // 🔹 Compute today's classes
  const todaysClasses = useMemo(() => {
    if (!classSchedules || classSchedules.length === 0) return [];

    const todayName = dayjs().format("dddd"); // e.g., "Sunday"
    return classSchedules.filter((cls) => {
      if (!cls.weekDay) return false;

      const isSameDay =
        cls.weekDay.name.toLowerCase() === todayName.toLowerCase();
      if (!isSameDay) return false;

      const startDate = dayjs(cls.startDate);
      const endDate = dayjs(cls.endDate);
      return dayjs().isBetween(startDate, endDate, "day", "[]");
    });
  }, [classSchedules]);

  return (
    <div className="py-4">
      {/* Today's Classes */}
      <h4 className="mt-4 mb-2 font-semibold text-lg">
        {t(LOCALE_KEYS.TODAY_CLASSES_TITLE)}
      </h4>
      <Row gutter={16}>
        {todaysClasses.length > 0 ? (
          todaysClasses.map((cls, idx) => (
            <Col span={8} key={idx}>
              <Card className="shadow-sm rounded-lg" style={{ padding: "0px" }}>
                <div className="flex justify-between mb-2">
                  <Tag color="blue">{cls.timeSlot?.name || "No Time"}</Tag>
                  <span className="text-gray-500">
                    {cls.maxCapacity || ""}
                  </span>
                </div>
                <div className="font-medium">
                  {cls.subject?.name || cls.faculty?.fullName || "No Subject"}
                </div>
                <div className="text-gray-400 text-sm">
                  {cls.room?.name || ""}
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <div className="text-gray-400 text-sm">No classes today</div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default TodaysClasses;
