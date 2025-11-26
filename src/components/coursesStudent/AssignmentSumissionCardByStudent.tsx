import { Button, Card, Tag } from "antd";
import dayjs from "dayjs";
import { BiEditAlt } from "react-icons/bi";

const AssignmentSubmissionCardByStudent = ({ data }) => {
  if (!data) return null;

  const {
    assignment,
    submittedAt,
    status,
    marksObtained,
  } = data;

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

      <Button
          type="primary"
          size="small"
          className="flex-1"
          icon={<BiEditAlt size={14} />}
          // onClick={() => handleEditDrawer(a.id)}
      >
          Edit
      </Button>
    </Card>
  );
};

export default AssignmentSubmissionCardByStudent;
