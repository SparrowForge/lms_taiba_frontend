"use client"
import { useRole } from '@/hooks/useRole';
import React from 'react';
import RecentAnnouncenments from "@/components/dashboard/newComponents/RecentAnnouncenments";
import StudentPerformance from "@/components/dashboard/newComponents/StudentPerformance";
import WeeklySchedule from "@/components/dashboard/newComponents/WeeklySchedule";
import { Col, Row } from 'antd';
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
              <Col xs={24} lg={16}>
                {/* For students, maybe show performance more prominently */}
                <StudentPerformance />
                <WeeklySchedule />
              </Col>
              <Col xs={24} lg={8}>
                <RecentAnnouncenments />
              </Col>
            </>
          )}</Row>
        </div>
    );
};

export default LayoutDashboard;