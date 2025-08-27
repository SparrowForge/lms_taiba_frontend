"use client"
import RecentAnnouncenments from "@/components/dashboard/newComponents/RecentAnnouncenments";
import StudentPerformance from "@/components/dashboard/newComponents/StudentPerformance";
import WeeklySchedule from "@/components/dashboard/newComponents/WeeklySchedule";

import { Col } from "antd";
const TeacherLayout = () => {
    return (
        <>
            <Col xs={24} lg={16}>
                <WeeklySchedule />
            </Col>
            <Col xs={24} lg={8}>
                <RecentAnnouncenments />
                <StudentPerformance />
            </Col>
        </>
    );
};

export default TeacherLayout;