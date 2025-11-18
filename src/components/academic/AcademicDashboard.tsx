'use client';

import { Col, Row } from 'antd';
import { useState } from 'react';

import AttendenceSummary from './AttendenceSummary';
import TabData from './TabData';
import UpcomingExam from './UpcomingExam';
import UpperDataSection from './UpperDataSection';
import WeeklySchedule from '../dashboard/newComponents/WeeklySchedule';
import UpperTab from '../lms/UpperTab';

// import CourseMaterials from './CourseMaterials';
// import RecentActivity from './RecentActivity';
// import StudentProgress from './StudentProgress';
// import UpperSection from './UpperSection';
// import UpperTab from './UpperTab';
// import UpperTabDatalms from './UpperTabDatalms';

const AcademicDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses_schedule');

  return (
    <div>
      <UpperTab items={TabData} onTabChange={(key) => setActiveTab(key)} />
      <UpperDataSection />

      <Row
        gutter={[24, 24]}
        className="pl-6"
        style={{ width: '100%', minWidth: 0, height: '100%' }}
      >
        <Col xs={24} lg={16} style={{ marginBottom: '40px' }}>
          {activeTab === 'courses_schedule' && <WeeklySchedule />}
          {activeTab === 'attendance' && <div>Attendence</div>}
          {activeTab === 'exams' && <div>exams Content</div>}
          {activeTab === 'grade_book' && <div>grade_book Content</div>}
        </Col>
        <Col xs={24} lg={8}>
          <AttendenceSummary />
          <UpcomingExam />
        </Col>
      </Row>
    </div>
  );
};

export default AcademicDashboard;
