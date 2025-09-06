'use client';

import {Col} from 'antd';

import { Col } from "antd";

import AcademicProgress from '../dashboard/newComponents/AcademicProgress';
import MonthlyAttendance from '../dashboard/newComponents/MonthlyAttendance';
import NotificationsStudent from '../dashboard/newComponents/NotificationsStudent';
import UpcomingAssignments from '../dashboard/newComponents/UpcomingAssignments';

const StudentLayout = () => {
  return (
    <>
      <Col xs={24} lg={8}>
        {/* For students, maybe show performance more prominently */}
        <AcademicProgress />
      </Col>
      <Col xs={24} lg={8}>
        <UpcomingAssignments />
      </Col>
      <Col xs={24} lg={8}>
        <MonthlyAttendance />
        <NotificationsStudent />
      </Col>
    </>
  );
};

export default StudentLayout;
