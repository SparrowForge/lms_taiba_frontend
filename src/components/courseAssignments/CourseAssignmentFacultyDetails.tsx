import { Card, Row, Col } from "antd";

import { useAuth } from "@/hooks/useAuth";


import { IBatch } from "@/types/batch";
import { ICourse } from "@/types/course";
import { ISemester } from "@/types/semester";
import { ISubject } from "@/types/subject";

const CourseAssignmentsFacultyDetails = ({semester,batch, course,subject, classNo}: 
  {semester: ISemester | null, batch: IBatch | null, course: ICourse | null,  subject: ISubject | null, classNo: number}) => {

  const {user} = useAuth()

  return (
    <Card title="Course Material Details" bordered className="shadow-sm" style={{marginBottom:"10px"}}>
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
          <div>{user?.faculty?.fullName || "—"}</div>
        </Col>
        <Col xs={24} md={12}>
          <strong>Class NO:</strong>
          <div>{classNo + 1 || "—"}</div>
        </Col>
      </Row>
    </Card>
  );
};

export default CourseAssignmentsFacultyDetails;
