'use client'
import { Col, Row } from 'antd';

import CourseMaterials from './CourseMaterials';
import MonthlyAttendance from '../dashboard/newComponents/MonthlyAttendance';
import RecentAnnouncenments from '../dashboard/newComponents/RecentAnnouncenments';

const LMSMainComponent = () => {
    return (
        <div>
            <CourseMaterials />
            <Row
                gutter={[24, 24]}
                className="pl-6"
                style={{ width: "100%", minWidth: 0, height: "100%" }}
            >
                <Col xs={24} lg={16}>
                    {/* <CourseMaterials /> */}
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