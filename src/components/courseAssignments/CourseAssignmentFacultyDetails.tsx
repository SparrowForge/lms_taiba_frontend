import { Card, Row, Col } from "antd";

const CourseAssignmentsFacultyDetails = ({semester,batch, course, faculty,subject, classNo}) => {
  return (
    <Card title="Assignment Details" bordered className="shadow-sm" style={{marginBottom:"10px"}}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <strong>Course:</strong>
          <div>{course?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Subject:</strong>
          <div>{subject?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Semester:</strong>
          <div>{semester?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Batch:</strong>
          <div>{batch?.name || "—"}</div>
        </Col>

        <Col span={12}>
          <strong>Faculty:</strong>
          <div>{faculty?.faculty?.fullName || "—"}</div>
        </Col>
        <Col span={12}>
          <strong>Class NO:</strong>
          <div>{classNo + 1 || "—"}</div>
        </Col>
      </Row>
    </Card>
  );
};

export default CourseAssignmentsFacultyDetails;
