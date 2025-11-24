import { Card, Row, Col } from "antd";

const CourseAssignmentsFacultyDetails = ({ data }:any) => {
  return (
    <Card title="Assignment Details" bordered className="shadow-sm" style={{marginBottom:"10px"}}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <strong>Course:</strong>
          <div>{data.course?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Subject:</strong>
          <div>{data.subject?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Semester:</strong>
          <div>{data.semester?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Batch:</strong>
          <div>{data.batch?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Faculty:</strong>
          <div>{data.faculty?.fullName || "—"}</div>
        </Col>
      </Row>
    </Card>
  );
};

export default CourseAssignmentsFacultyDetails;
