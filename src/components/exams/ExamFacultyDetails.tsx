import { Card, Row, Col } from "antd";

import { IBatch } from "@/types/batch";
import { ICourse } from "@/types/course";
import { IFaculty } from "@/types/faculty";
import { ISemester } from "@/types/semester";
import { ISubject } from "@/types/subject";

const ExamFacultyDetails = ({semester,batch, course, faculty,subject, }: {semester: ISemester | null, batch: IBatch | null, course: ICourse | null, faculty: IFaculty | null, subject: ISubject | null,}) => {

  return (
    <Card title="Faculty Details" bordered className="shadow-sm" style={{marginBottom:"10px"}}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <strong>Course:</strong>
          <div>{course?.name || "—"}</div>
        </Col>

        <Col xs={24} md={12}>
          <strong>Subject:</strong>
          <div>{subject?.name || "—"}</div>
        </Col>

        <Col xs={24} md={12}>
          <strong>Semester:</strong>
          <div>{semester?.name || "—"}</div>
        </Col>

        <Col xs={24} md={12}>
          <strong>Batch:</strong>
          <div>{batch?.name || "—"}</div>
        </Col>

        <Col xs={24} md={12}>
          <strong>Faculty:</strong>
          <div>{faculty?.fullName || "—"}</div>
        </Col>
       
      </Row>
    </Card>
  );
};

export default ExamFacultyDetails;
