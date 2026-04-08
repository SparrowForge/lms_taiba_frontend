"use client";

import { Button, Card, Tag } from "antd";
import { useRouter } from "next/navigation";

import { IExam } from "@/types/exam";



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

const StudentExamList = ({ data }: ExamListProps) => {
  const router = useRouter()
  const handlePrepareExam = (subjectId: number, examId: number) => {
    return router.push(`/exam-instructions?subjectId=${subjectId}&examId=${examId}`)
  }

  function isExamButtonDisabled(examDatetime:any) {
    return new Date(examDatetime).toDateString() !== new Date().toDateString();
  }



  return (

    <Card
      key={data.id}
      className="shadow-md rounded-xl border"
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold">{data.name}</span>
          <Tag color="blue">{data?.examType?.name}</Tag>
        </div>
      }
    >
      <div className="space-y-2 text-sm">
        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex gap-2">
            <span className="min-w-[80px] font-medium text-gray-900">
              Subject:
            </span>
            <span>{data?.subject?.name}</span>
          </p>

          <p className="flex gap-2">
            <span className="min-w-[80px] font-medium text-gray-900">
              Marks:
            </span>
            <span>{data.marks}</span>
          </p>

          <p className="flex gap-2">
            <span className="min-w-[80px] font-medium text-gray-900">
              Date:
            </span>
            <span>{formatDate(data.examDatetime)}</span>
          </p>

          <p className="flex gap-2">
            <span className="min-w-[80px] font-medium text-gray-900">
              Time:
            </span>
            <span>{formatTime(data.examDatetime)}</span>
          </p>

          <p className="flex gap-2">
            <span className="min-w-[80px] font-medium text-gray-900">
              Duration:
            </span>
            <span>
              {data.duration?.hours
                ? `${data.duration.hours} hr${data.duration.hours > 1 ? "s" : ""}`
                : ""}
              {data.duration?.minutes ? ` ${data.duration.minutes} min` : ""}
            </span>
          </p>

          <p className="flex gap-2">
            <span className="min-w-[80px] font-medium text-gray-900">
              Room:
            </span>
            <span>{data.room?.name}</span>
          </p>
        </div>

        <Button
          type="primary"
          onClick={() => handlePrepareExam(data.subjectId, data.id)}
          disabled={isExamButtonDisabled(data?.examDatetime)}
        >
          Start Exam
        </Button>

      </div>
    </Card>

  );
};

export default StudentExamList;
