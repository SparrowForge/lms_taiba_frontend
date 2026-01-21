import { Button, Card, Tag } from "antd";
import dayjs from "dayjs";
import { BiEditAlt } from "react-icons/bi";
import CourseAssignmentSubmissionFormDrawer from "../courseAssignmentSubmissions/CourseAssignmentSubmissionFormDrawer";
import { useState } from "react";
import { useCourseAssignmentSubmissions } from "@/hooks/useCourseAssignmentSubmissions";
import { useAuth } from "@/hooks/useAuth";
import { ICourseAssignmentSubmission } from "@/types/courseAssignmentSubmission";

const AssignmentSubmissionCardByStudent = ({ data }: { data: ICourseAssignmentSubmission }) => {
    const {
    student,
    assignment,
    submittedAt,
    status,
    marksObtained,
  } = data;
    const {user} = useAuth()
    const { loadCourseAssignmentSubmissions } = useCourseAssignmentSubmissions()
    const [assignmentSubmissiondrawerMode, setAssignmentSubmissionDrawerMode] = useState<'create' | 'edit'>('create');
    const [assignmentSubmissionDrawerVisible, setAssignmentSubmissionDrawerVisible] = useState(false);
    const [selectedAssignmentSubmissionId, setSelectedAssignmentSubmissionId] = useState<number | undefined>();

      const handleAssignmentSubmissionDrawerSuccess = () => {
        setAssignmentSubmissionDrawerVisible(false);
        loadCourseAssignmentSubmissions({ page: 1, limit: 10 });
      };
    
    const handleEditDrawer = (courseAssignmentSubmissionId: number) => {
        setSelectedAssignmentSubmissionId(courseAssignmentSubmissionId);
        setAssignmentSubmissionDrawerMode('edit');
        setAssignmentSubmissionDrawerVisible(true);
      };
    



  return (
    <Card
      title={assignment?.title || "Assignment Submission"}
      bordered
      style={{ width: "100%", marginTop: 16 }}
    >
      <p><strong>Description:</strong> {assignment?.description}</p>
      <p><strong>Total Marks:</strong> {assignment?.totalMarks}</p>
      <p><strong>Pass Marks:</strong> {assignment?.passMarks}</p>
      <p><strong>Due Date:</strong> {assignment?.dueDate}</p>

      {
         user?.faculty?.id && <>
         
         <hr style={{ margin: "12px 0" }} />

      {/* Student Info */}
      <p><strong>Student:</strong> {student?.firstName} {student?.middleName} {student?.lastName}</p>
      <p><strong>Student ID:</strong> {student?.id}</p>
</>
      }

      <hr style={{ margin: "12px 0" }} />

      {/* Submission Info */}
      <p>
        <strong>Submitted At:</strong>{" "}
        {submittedAt ? dayjs(submittedAt).format("YYYY-MM-DD HH:mm:ss") : "Not Submitted"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <Tag
          color={
            status === "draft"
              ? "orange"
              : status === "submitted"
              ? "blue"
              : status === "graded"
              ? "green"
              : "default"
          }
        >
          {status.toUpperCase()}
        </Tag>
      </p>

      <p>
        <strong>Marks Obtained:</strong>{" "}
        {marksObtained !== null ? marksObtained : "Not Graded"}
      </p>
{/* 
      <Button
          type="primary"
          size="small"
          className="flex-1"
          icon={<BiEditAlt size={14} />}
          onClick={() => handleEditDrawer(data.id)}
      >
          Edit
      </Button> */}

      <CourseAssignmentSubmissionFormDrawer
        mode={assignmentSubmissiondrawerMode}
        courseAssignmentSubmissionId={selectedAssignmentSubmissionId}
        visible={assignmentSubmissionDrawerVisible}
        onCancel={() => setAssignmentSubmissionDrawerVisible(false)}
        onSuccess={handleAssignmentSubmissionDrawerSuccess}
        isAdmin={false}
      />
    </Card>
  );
};

export default AssignmentSubmissionCardByStudent;
