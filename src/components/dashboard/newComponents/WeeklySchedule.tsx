"use client";

import React, { useState } from "react";
import { Calendar, Card, Tag, Segmented, Row, Col } from "antd";
import type { Dayjs } from "dayjs";

import dayjs from "dayjs";

const classes = {
  Mon: [
    { title: "Programming", time: "9:30 - 11:00", color: "blue" },
    { title: "Database", time: "12:30 - 2:00", color: "green" },
  ],
  Tue: [
    { title: "Web Dev", time: "11:30 - 1:00", color: "geekblue" },
    { title: "UI Design", time: "2:30 - 4:00", color: "cyan" },
  ],
  Wed: [{ title: "Data Science", time: "10:00 - 11:30", color: "purple" }],
  Thu: [{ title: "Python", time: "9:00 - 10:30", color: "green" }],
};

const WeeklySchedule: React.FC = () => {
  const [view, setView] = useState("Week");

  const dateCellRender = (date: Dayjs) => {
    const weekday = date.format("ddd"); // Mon, Tue, ...
    const dayClasses = classes[weekday as keyof typeof classes] || [];
    return (
      <ul className="m-0 p-0 list-none">
        {dayClasses.map((cls, index) => (
          <li key={index}>
            <Tag color={cls.color} className="block text-center mb-1">
              {cls.title} <br /> {cls.time}
            </Tag>
          </li>
        ))}
      </ul>
    );
  };

  // Fake today's classes
  const todaysClasses = [
    {
      time: "11:30 AM",
      duration: "50 min",
      title: "Web Development",
      room: "Room 305 • 28 students",
    },
    {
      time: "2:30 PM",
      duration: "90 min",
      title: "UI Design Fundamentals",
      room: "Lab 102 • 24 students",
    },
  ];

  return (
    <Card className="shadow-md rounded-xl">
      {/* Header */}
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <h3 className="font-semibold text-lg">
            Weekly Schedule <span className="ml-2">|</span>{" "}
            <span className="font-normal">الجدول الأسبوعي</span>
          </h3>
        </Col>
        <Col>
          <Segmented
            options={["Week", "Month"]}
            value={view}
            onChange={(val) => setView(val as string)}
          />
        </Col>
      </Row>

      {/* Calendar */}
      <Calendar
        fullscreen={false}
        headerRender={() => null}
        dateCellRender={dateCellRender}
      />

      {/* Today's Classes */}
      <h4 className="mt-4 mb-2 font-semibold">Today&apos;s Classes | دروس اليوم</h4>
      <Row gutter={16}>
        {todaysClasses.map((cls, idx) => (
          <Col span={12} key={idx}>
            <Card className="shadow-sm rounded-lg">
              <div className="flex justify-between mb-2">
                <Tag color="blue">{cls.time}</Tag>
                <span className="text-gray-500">{cls.duration}</span>
              </div>
              <div className="font-medium">{cls.title}</div>
              <div className="text-gray-400 text-sm">{cls.room}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default WeeklySchedule;
