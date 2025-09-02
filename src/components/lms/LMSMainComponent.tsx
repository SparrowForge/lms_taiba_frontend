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
                    {activeTab === "courses" && <CourseMaterials
                        locale="en"
                        materials={[
                            {
                                id: "1",
                                title: "Introduction to JavaScript",
                                localTitle: "مقدمة في جافا سكربت",
                                type: "Lecture",
                                course: "Web Development",
                                size: "6.2 MB",
                                uploaded: "Yesterday",
                                icon: "pdf",
                            },
                            {
                                id: "2",
                                title: "Data Modeling Tutorial",
                                localTitle: "درس نمذجة البيانات",
                                type: "Video",
                                course: "Data Science",
                                size: "128 MB",
                                uploaded: "3 days ago",
                                icon: "video",
                            },
                            {
                                id: "3",
                                title: "UI Design Principles",
                                localTitle: "مبادئ تصميم واجهة المستخدم",
                                type: "Assignment",
                                course: "UI/UX Design",
                                size: "1.4 MB",
                                uploaded: "1 week ago",
                                icon: "assignment",
                            },
                        ]}
                    />
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