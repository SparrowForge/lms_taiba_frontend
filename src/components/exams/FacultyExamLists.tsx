"use client";

import { Button, Card, Tag } from "antd";

import { IExam } from "@/types/exam";
import { useRouter } from "next/navigation";





export const formatDate = (value: string) => {
  const date = new Date(value);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // Dec
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


interface ExamListProps {
  data: IExam;
}

const FacultyExamList = ({ data }: ExamListProps) => {
  const router = useRouter()
  const handleAddQuestion =(subjectId:number) =>{
    return router.push(`/exam-mcq-questions/create?subjectId=${subjectId}`)
  }
  return (
    
        <Card
          key={data.id}
          className="shadow-md rounded-xl border"
          title={
            <div className="flex justify-between items-center">
              <span className="font-semibold">{data.name}</span>
              <Tag color="blue">{data.examType?.name}</Tag>
            </div>
          }
        >
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Subject:</span>{" "}
              {data.subject?.name}
            </p>

            <p>
              <span className="font-medium">Marks:</span> {data.marks}
            </p>

            <p>
              <span className="font-medium">Date:</span>{" "}
              {formatDate(data.examDatetime)}
            </p>

            <p>
              <span className="font-medium">Time:</span>{" "}
              {formatTime(data.examDatetime)}
            </p>

            <p>
              <span className="font-medium">Duration:</span>{" "}
              {data.duration?.hours
                ? `${data.duration.hours} hr${data.duration.hours > 1 ? "s" : ""}`
                : ""}
              {data.duration?.minutes
                ? ` ${data.duration.minutes} min`
                : ""}
            </p>

            <p>
              <span className="font-medium">Room:</span>{" "}
              {data.room?.name}
            </p>
            <Button
              type="primary"
              // icon={<PlusOutlined />}
              style={{ width: "20%", marginBottom: 12 }}
              onClick={()=>handleAddQuestion(data.subjectId)}
            >
              Add Question
            </Button>
          </div>
        </Card>

  );
};

export default FacultyExamList;
