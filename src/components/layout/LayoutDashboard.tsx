"use client"
import { Col, Row } from 'antd';

import RecentAnnouncenments from "@/components/dashboard/newComponents/RecentAnnouncenments";
import StudentPerformance from "@/components/dashboard/newComponents/StudentPerformance";
import WeeklySchedule from "@/components/dashboard/newComponents/WeeklySchedule";

import { useRole } from '@/hooks/useRole';

import AcademicProgress from '../dashboard/newComponents/AcademicProgress';
import MonthlyAttendance from '../dashboard/newComponents/MonthlyAttendance';
import NotificationsStudent from '../dashboard/newComponents/NotificationsStudent';
import UpcomingAssignments from '../dashboard/newComponents/UpcomingAssignments';

const LayoutDashboard = () => {
    const role = useRole();
    return (
        <div>
            <Row
                gutter={[24, 24]}
                className="pl-6"
                style={{ width: "100%", minWidth: 0, height: "100%" }}
            >
                {role === "teacher" ? (
                    <>
                        <Col xs={24} lg={16}>
                            <WeeklySchedule />
                        </Col>
                        <Col xs={24} lg={8}>
                            <RecentAnnouncenments />
                            <StudentPerformance />
                        </Col>
                    </>
                ) : (
                    <>
                        <Col xs={24} lg={8}>
                            {/* For students, maybe show performance more prominently */}
                           <AcademicProgress/>
                        </Col>
                        <Col xs={24} lg={8}>
                           <UpcomingAssignments/>
                           
                        </Col>
                        <Col xs={24} lg={8}>
                            <MonthlyAttendance/>
                            <NotificationsStudent/>
                        </Col>
                    </>
                )}</Row>
        </div>
    );
};

export default LayoutDashboard;