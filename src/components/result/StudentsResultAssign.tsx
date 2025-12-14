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
import { STUDENT_STATUS_OPTIONS } from "@/constants/statusOptions"
import { Status } from "@/enums"

import { useExams } from "@/hooks/useExams"
import { useLocalization } from "@/hooks/useLocalization"
import { useStudents } from "@/hooks/useStudents"



import { IStudent } from "@/types/student"

import type { ColumnsType } from "antd/es/table"

const { Title, Text } = Typography



const calculateGrade = (marks: number | null): string => {
  if (marks === null) return "-"
  if (marks >= 90) return "A+"
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  return "F"
}

export default function StudentResultAssign() {
  const searchParams = useSearchParams()
  const examId = searchParams.get("examId")
  const {t} = useLocalization()
  const { loadStudents, students, listStatus } = useStudents()
  const { loadExam, selectedExam } = useExams()
   

  const [tableData, setTableData] = useState<IStudent>([])

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

  // 🔹 Sync API students to local table state
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

  const handleMarksChange = (key: string, marks: number | null) => {
    setTableData((prev) =>
      prev.map((s) =>
        s.key === key
          ? { ...s, marks, grade: calculateGrade(marks) }
          : s,
      ),
    )
  }

  const handleStatusChange = (key: string, status: "draft" | "submitted") => {
    setTableData((prev) =>
      prev.map((s) =>
        s.key === key ? { ...s, status } : s,
      ),
    )
  }

  const handleRemarksChange = (key: string, remarks: string) => {
    setTableData((prev) =>
      prev.map((s) =>
        s.key === key ? { ...s, remarks } : s,
      ),
    )
  }

  const handleSubmit = async () => {
    const hasMissingMarks = tableData.some(
      (s) => s.marks === null || s.marks === undefined,
    )

    if (hasMissingMarks) {
      toast.error("Please enter marks for all students")
      return
    }

    const hasMissingStatus = tableData.some((s) => !s.status)

    if (hasMissingStatus) {
      toast.error("Please select status for all students")
      return
    }

    const payload = tableData.map((s) => ({
      examId: Number(examId),
      studentId: s.id,
      marksObtained: s.marks!,
      grade: s.grade,
      remarks: s.remarks ?? "",
      status: s.status!,
    }))

    console.log("SUBMIT PAYLOAD 👉", payload)

  }

  const columns: ColumnsType<IStudent> = [
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
          value={record.marks}
          onChange={(value) => handleMarksChange(record.key, value)}
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
            handleRemarksChange(record.key, e.target.value)
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
          value={record.status}
          onChange={(value) =>
            handleStatusChange(record.key, value as "draft" | "submitted")
          }
          style={{ width: "100%" }}
          options={STUDENT_STATUS_OPTIONS}
        />
      ),
    },
  ]

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={3}>{t(LOCALE_KEYS.STUDENT_MARKS_ENTRY)}</Title>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          bordered
          rowKey="key"
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
