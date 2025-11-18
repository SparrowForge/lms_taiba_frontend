'use client';
import {Col} from 'antd';

import RecentAnnouncenments from '@/components/dashboard/newComponents/RecentAnnouncenments';
import StudentPerformance from '@/components/dashboard/newComponents/StudentPerformance';
import ScheduleView from '@/components/dashboard/schedule/ScheduleView';

const TeacherLayout = () => {
  return (
    <>
      <Col xs={24} lg={16}>
        <ScheduleView />
      </Col>
      <Col xs={24} lg={8}>
        <RecentAnnouncenments />
        <StudentPerformance />
      </Col>
    </>
  );
};

export default TeacherLayout;
