"use client"

import {
  TrophyOutlined,
  BookOutlined,
} from "@ant-design/icons"
import {
  Card,
  Table,
  Tag,
  Space,
  Badge,
  Progress,
  Tabs,
  Typography,
  Empty,
} from "antd"
import { useEffect, useMemo } from "react"

import { useAuth } from "@/hooks/useAuth"
import { useExamResults } from "@/hooks/useExamResults"

import type { ColumnsType } from "antd/es/table"

const { Text } = Typography




export default function StudentSubjectGrading() {
  const { loadSubjectResults, subjectResults } = useExamResults()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.student?.id) {
      loadSubjectResults({ page: 1, limit: 99, studentId: user.student.id })
    }
  }, [user?.student?.id, loadSubjectResults])

  const groupedResults = useMemo(() => {
    const results = Array.isArray(subjectResults) ? subjectResults : []

    return results.reduce((acc: any, item: GradeData) => {
      if (!item.semester || !item.subject) return acc

      const semesterName = item.semester.name ?? "Unknown Semester"
      const subjectName = item.subject.name ?? "Unknown Subject"

      if (!acc[semesterName]) acc[semesterName] = {}
      if (!acc[semesterName][subjectName]) acc[semesterName][subjectName] = []

      acc[semesterName][subjectName].push({
        key: String(item.id),
        examName: item.subject.code,
        marks: item.totalMarks,
        totalMarks: item.totalMarks,
        grade: item.grade,
        remarks: item.remarks,
        status: item.status === "published" ? "pass" : "fail",
      })

      return acc
    }, {})
  }, [subjectResults])



  const columns: ColumnsType<ExamRow> = [
    {
      title: "Subject Code",
      dataIndex: "examName",
      render: (text) => (
        <Space>
          <BookOutlined />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "Marks",
      align: "center",
      render: (_, r) => `${r.marks} / ${r.totalMarks}`,
    },
    {
      title: "Percentage",
      align: "center",
      render: (_, r) => {
        const percent = r.totalMarks
          ? (r.marks / r.totalMarks) * 100
          : 0

        return (
          <Progress
            type="circle"
            percent={+percent.toFixed(1)}
            width={60}
          />
        )
      },
    },
    {
      title: "Grade",
      dataIndex: "grade",
      align: "center",
      render: (grade) => <Tag color="blue">{grade}</Tag>,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      align: "center",
      render: (remarks) => (
        <Tag color="green">{remarks || "No remarks"}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status) => (
        <Badge
          status={status === "pass" ? "success" : "error"}
          text={status === "pass" ? "Passed" : "Failed"}
        />
      ),
    },
  ]

  if (!subjectResults || subjectResults.length === 0) {
    return <Empty description="No grading subjectResults available" />
  }



  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>

      <Card
        style={{ height: "calc(100vh - 220px)" }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
          <Tabs
            type="card"
            items={Object.entries(groupedResults).map(
              ([semesterName, subjects]: any) => ({
                key: semesterName,
                label: semesterName,
                children: (
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    {Object.entries(subjects).map(
                      ([subjectName, exams]: any) => (
                        <Card
                          key={subjectName}
                          title={
                            <Text strong>
                              Subject: {subjectName}
                            </Text>
                          }
                        >
                          <Table
                            bordered
                            pagination={false}
                            columns={columns}
                            dataSource={exams}
                          />
                        </Card>
                      )
                    )}
                  </Space>
                ),
              })
            )}
          />
        </div>
      </Card>
    </div>
  )
}
