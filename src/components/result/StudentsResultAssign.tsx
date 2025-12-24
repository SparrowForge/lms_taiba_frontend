"use client"

import {
  Table,
  InputNumber,
  Button,
  Space,
  Typography,
  Card,
  Select,
  Input,
} from "antd"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { LOCALE_KEYS } from "@/constants/localizationKeys"
import {  EXAM_RESULT_STATUS_OPTIONS,  } from "@/constants/statusOptions"
import {  Status, } from "@/enums"
import { ExamResultStatus } from "@/enums/exam-candidate.enum"
import { calculateGrade } from "@/utils/calculateGradeUtils"

import { useExamResults } from "@/hooks/useExamResults"
import { useExams } from "@/hooks/useExams"
import { useGradeRules } from "@/hooks/useGradeRules"
import { useLocalization } from "@/hooks/useLocalization"
import { useStudents } from "@/hooks/useStudents"

import { IExamResult } from "@/types/examResult"


import type { ColumnsType } from "antd/es/table"

const { Title, Text } = Typography




export default function StudentResultAssign() {
  const searchParams = useSearchParams()
  const examId = searchParams.get("examId")
  const { t } = useLocalization()

  const { loadStudents, students, listStatus } = useStudents()
  const { loadExam, selectedExam } = useExams()
  const { gradeRules, loadGradeRules } = useGradeRules()
  const {createExamResultBulk, actionStatus} = useExamResults()

  const [tableData, setTableData] = useState<IExamResult[]>([])



  useEffect(() => {
    loadGradeRules({ page: 1, limit: 99 })
  }, [loadGradeRules])


  useEffect(() => {
    if (examId) {
      loadExam(Number(examId))
    }
  }, [examId, loadExam])


  useEffect(() => {
    if (selectedExam?.batchId) {
      loadStudents({
        page: 1,
        limit: 99,
        batchId: selectedExam.batchId,
      })
    }
  }, [loadStudents, selectedExam?.batchId])


  useEffect(() => {
    if (students?.length) {
      setTableData(
        students.map((s: any) => ({
          ...s,
          marks: s.marks ?? null,
          grade: s.grade ?? "-",
          remarks: s.remarks ?? "",
          status: s.status,
        })),
      )
    }
  }, [students])

  const handleMarksChange = (id: number, marks: number | null) => {
    setTableData((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
            ...s,
            marks,
            grade: calculateGrade(marks, gradeRules),
          }
          : s,
      ),
    )
  }

  const handleRemarksChange = (id: number, remarks: string) => {
    setTableData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, remarks } : s)),
    )
  }

  const handleStatusChange = (id: number, status: ExamResultStatus) => {
    setTableData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    )
  }


  const handleSubmit = async () => {
    if (tableData.some((s) => s.marksObtained === null)) {
      toast.error("Please enter marks for all students")
      return
    }

    if (tableData.some((s) => !s.status)) {
      toast.error("Please select status for all students")
      return
    }

    const payload = tableData.map((s) => ({
      examId: Number(examId),
      studentId: s.id,
      marksObtained: s.marksObtained!,
      grade: s.grade,
      remarks: s.remarks ?? "",
      status: s.status!,
    }))
    const finalPayload = {
      results:payload
    }

    console.log("SUBMIT PAYLOAD", finalPayload)
    await createExamResultBulk(finalPayload)
  }

  /* -------- Columns -------- */
  const columns: ColumnsType<IExamResult> = [
    {
      title: "S.No",
      dataIndex: "id",
      align: "center",
      width: 80,
    },
    {
      title: "Student Name",
      dataIndex: "firstName",
    },
    {
      title: "Marks",
      dataIndex: "marks",
      width: 140,
      render: (_, record) => (
        <InputNumber
          min={0}
          max={100}
          value={record.marksObtained}
          onChange={(value) => handleMarksChange(record.id, value)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      align: "center",
      width: 90,
      render: (grade) => <Text strong>{grade}</Text>,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      width: 200,
      render: (_, record) => (
        <Input
          placeholder="Remarks"
          value={record.remarks}
          onChange={(e) =>
            handleRemarksChange(record.id, e.target.value)
          }
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      render: (_, record) => (
        <Select
          placeholder="Select status"
          // value={record.status}
          onChange={(value) =>
            handleStatusChange(record.id, value as ExamResultStatus)
          }
          style={{ width: "100%" }}
          options={EXAM_RESULT_STATUS_OPTIONS}
        />
      ),
    },
  ]

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={3}>
          {t(LOCALE_KEYS.STUDENT_MARKS_ENTRY)}
        </Title>

        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          bordered
          rowKey="id"
          loading={listStatus.status === Status.LOADING}
        />

        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={handleSubmit}>
            Submit Results
          </Button>
        </Space>
      </Space>
    </Card>
  )
}
