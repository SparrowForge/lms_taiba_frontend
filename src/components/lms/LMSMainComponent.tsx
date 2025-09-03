'use client'
import { Col, Row } from 'antd';

import CourseMaterials from './CourseMaterials';
import MonthlyAttendance from '../dashboard/newComponents/MonthlyAttendance';
import RecentAnnouncenments from '../dashboard/newComponents/RecentAnnouncenments';
import UpperSection from './UpperSection';
import UpperTab from './UpperTab';
import { useState } from 'react';

const LMSMainComponent = () => {
    const [activeTab, setActiveTab] = useState("courses");
    return (
        <div >
            <UpperTab onTabChange={(key) => setActiveTab(key)} />
            <UpperSection />
            <Row
                gutter={[24, 24]}
                className="pl-6"
                style={{ width: "100%", minWidth: 0, height: "100%" }}
            >
                <Col xs={24} lg={16}>
                    {activeTab === "courses" && <CourseMaterials />
                    }
                    {activeTab === "quizzes" && <div>Quizzes Content</div>}
                    {activeTab === "submissions" && <div>Submissions Content</div>}
                    {activeTab === "discussion" && <div>Discussion Content</div>}
                    {activeTab === "grading" && <div>Grading Content</div>}
                </Col>
                <Col xs={24} lg={8}>
                    <MonthlyAttendance />
                    <RecentAnnouncenments />

                </Col>
            </Row>
        </div>
    );
};

export default LMSMainComponent;