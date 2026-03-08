"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Tag } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { hasAnyHeadRole } from "@/utils/roleUtils";

import { useAuth } from "@/hooks/useAuth";

import { IExam } from "@/types/exam";



import ExamSetManageDrawer from "./ExamSetManageDrawer";
import ExamFacultyAssignDrawer from "../faculties/ExamFacultyAssignmentDrawer";
import { useExams } from "@/hooks/useExams";



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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [facultyDrawerVisible, setFacultyDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const { loadExams } = useExams()
  const params = useParams()
  const searchParams = useSearchParams()
  const subjectId = params.id as string
  const semesterId = searchParams.get('semesterId') as string
  const batchId = searchParams.get('batchId') as string

  const router = useRouter()


  const handleAddQuestionSet = (examId: number) => {
    return router.push(`/question-set/create?examId=${examId}`)
  }

  const handleCreateDrawer = () => {
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  const handleCreateFacultyAddDrawer = () => {
    setFacultyDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
    loadExams({ page: 1, limit: 99, subjectId: Number(subjectId), semesterId: Number(semesterId), batchId: batchId ? Number(batchId) : undefined })
  };



  const handleAddResult = (examId: number) => {
    return router.push(`/result/create?examId=${examId}`)
  }
  const handleReviewExam = () => {
    return router.push(`/exam-submission/details?subjectId=${subjectId}`)
  }

  const { user } = useAuth()

  const isHead = user ? hasAnyHeadRole(user) : false

  console.log("object, user", user)


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
        <div className="pb-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Subject</span>
              <span className="font-medium text-gray-900">
                {data.subject?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Marks</span>
              <span className="font-medium text-gray-900">
                {data.marks}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Date</span>
              <span className="font-medium text-gray-900">
                {formatDate(data.examDatetime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Time</span>
              <span className="font-medium text-gray-900">
                {formatTime(data.examDatetime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Duration</span>
              <span className="font-medium text-gray-900">
                {data.duration?.hours
                  ? `${data.duration.hours} hr${data.duration.hours > 1 ? "s" : ""}`
                  : ""}
                {data.duration?.minutes ? ` ${data.duration.minutes} min` : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Room</span>
              <span className="font-medium text-gray-900">
                {data.room?.name}
              </span>
            </div>
          </div>
        </div>


        {
          isHead && <>
            <Button
              type="primary"
              icon={<PlusOutlined />}

              onClick={() => handleCreateFacultyAddDrawer()}
            >
              Add Faculty
            </Button>
            <Button
              color="primary"
              variant="filled"
              icon={<PlusOutlined />}
              style={{ marginLeft: 16 }}
              onClick={() => handleAddQuestionSet(data.id)}
            >
              Add Question Set
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginLeft: 16 }}
              onClick={() => handleCreateDrawer()}
            >
              Manage Question Set
            </Button>

          </>
        }

        <Button
          color="primary"
          variant="dashed"
          style={{ marginLeft: 16 }}
          onClick={() => handleReviewExam()}
        >
          Review
        </Button>

        {/* <Button
          color="primary"
          variant="outlined"
          icon={<PlusOutlined />}
          style={{ marginLeft: 16 }}
          onClick={() => handleAddResult(data.id)}
        >
          Add Result
        </Button> */}
      </div>

      <ExamSetManageDrawer
        mode={drawerMode}
        examId={data.id}
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        onSuccess={handleDrawerSuccess}
      />

      <ExamFacultyAssignDrawer
        examId={data.id}
        visible={facultyDrawerVisible}
        onCancel={() => setFacultyDrawerVisible(false)}
        onSuccess={handleDrawerSuccess}
      />
    </Card>

  );
};

export default FacultyExamList;
