'use client';
import { Col, Row } from 'antd';
import { useState } from 'react';

import CourseMaterials from './CourseMaterials';
import RecentActivity from './RecentActivity';
import StudentProgress from './StudentProgress';
import UpperSection from './UpperSection';
import UpperTab from './UpperTab';
import UpperTabDatalms from './UpperTabDatalms';

const LMSMainComponent = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div>
      <UpperTab items={UpperTabDatalms} onTabChange={(key) => setActiveTab(key)} initial={null} />
      <UpperSection />
      <Row
        gutter={[24, 24]}
        className="pl-6"
        style={{ width: '100%', minWidth: 0, height: '100%' }}
      >
        <Col xs={24} lg={16} style={{ marginBottom: '40px' }}>
          {activeTab === 'courses' && <CourseMaterials />}
          {activeTab === 'quizzes' && <div>Quizzes Content</div>}
          {activeTab === 'submissions' && <div>Submission Content</div>}

        </Col>
        <Col xs={24} lg={8}>
          <StudentProgress />
          <RecentActivity />
        </Col>
      </Row>
    </div>
  );
};

export default LMSMainComponent;
