'use client';

import { Col, Row } from "antd";

import Attendence from "./Attendence";
import HeaderSection from "./HeaderSection";
import ParentsSection from "./ParentsSection";
import ReportsDocuments from "./ReportsDocuments";
import SubjectGrades from "./SubjectGrades";

const GradeDashboard = () => {
  return (
    <div className="mx-10 my-10">
      {/* Top stats */}
      <HeaderSection />

      {/* Content Section */}
      <Row gutter={[24, 24]} style={{ width: "100%", minWidth: 0, height: "100%" }}>

        <Col xs={24} lg={16} style={{ marginBottom: "40px" }}>
          <SubjectGrades />
        </Col>


        <Col xs={24} lg={8}>
      
            <Attendence />
            <ReportsDocuments />
            <ParentsSection/>
     
        </Col>
      </Row>
    </div>
  );
};

export default GradeDashboard;
