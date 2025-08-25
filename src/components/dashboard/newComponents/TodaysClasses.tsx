"use client";
import { Card, Tag, Row, Col } from "antd";

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
const TodaysClasses = () => {
    return (
        <div className="py-4">
            {/* Today's Classes */}
            <h4 className="mt-4 mb-2 font-semibold text-lg">Today&apos;s Classes | دروس اليوم</h4>
            <Row gutter={16}>
                {todaysClasses.map((cls, idx) => (
                    <Col span={8} key={idx}>
                        <Card className="shadow-sm rounded-lg" style={{padding: "0px"}}>
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
        </div>
    );
};

export default TodaysClasses;