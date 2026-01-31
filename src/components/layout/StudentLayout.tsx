'use client';

import { Col } from 'antd';

import { StudentSchedule } from './StudentSchedule';
import AcademicProgress from '../dashboard/newComponents/AcademicProgress';
import MonthlyAttendance from '../dashboard/newComponents/MonthlyAttendance';
import NotificationsStudent from '../dashboard/newComponents/NotificationsStudent';
import UpcomingAssignments from '../dashboard/newComponents/UpcomingAssignments';

const StudentLayout = () => {
  return (
    <>
      <Col xs={24} lg={12}>
        {/* For students, maybe show performance more prominently */}
        {/* <AcademicProgress /> */}
        <StudentSchedule />
      </Col>
      <Col xs={24} lg={6}>
        <AcademicProgress />

      </Col>
      <Col xs={24} lg={6}>
        <UpcomingAssignments />
        <MonthlyAttendance />
        <NotificationsStudent />
      </Col>
    </>
  );
};

export default StudentLayout;
