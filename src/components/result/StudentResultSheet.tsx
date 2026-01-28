"use client"

import {
  TrophyOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons"
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Space,
  Badge,
  Progress,
  Tabs,
  Typography,
} from "antd"
import { useParams } from "next/navigation"
import { useEffect, useMemo } from "react"

import { useBatches } from "@/hooks/useBatches"
import { useCourses } from "@/hooks/useCourses"
import { useExamResults } from "@/hooks/useExamResults"

import type { ColumnsType } from "antd/es/table"

const { Text } = Typography

interface ExamRow {
  key: string
  examName: string
  marks: number
  totalMarks: number
  grade: string
  remarks: string
  status: "pass" | "fail"
}

export default function StudentResultSheet() {
  const { id } = useParams()

  const { loadExamResults, examResults } = useExamResults()
  const { loadCourse, selectedCourse } = useCourses()
  const { loadBatch, selectedBatch } = useBatches()

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    if (id) {
      loadExamResults({ page: 1, limit: 99, studentId: id })
    }
  }, [id, loadExamResults])

  useEffect(() => {
    if (examResults?.[0]?.student?.courseId) {
      loadCourse(examResults[0].student.courseId)
    }
  }, [examResults, loadCourse])

  useEffect(() => {
    if (examResults?.[0]?.student?.batchId) {
      loadBatch(examResults[0].student.batchId)
    }
  }, [examResults, loadBatch])

  /* ---------------- GROUP: Semester → Subject ---------------- */

  const groupedResults = useMemo(() => {
    const results = Array.isArray(examResults) ? examResults : []

    return results.reduce((acc: any, item: any) => {
      if (!item.exam) return acc // ignore invalid exam rows

      const semesterName = item.exam.semester?.name ?? "Unknown Semester"
      const subjectName = item.exam.subject?.name ?? "Unknown Subject"

      if (!acc[semesterName]) acc[semesterName] = {}
      if (!acc[semesterName][subjectName]) acc[semesterName][subjectName] = []

      acc[semesterName][subjectName].push({
        key: String(item.id),
        examName: item.exam.name,
        marks: item.marksObtained,
        totalMarks: item.exam.marks,
        grade: item.grade,
        remarks: item.remarks,
        status: item.status === "published" ? "pass" : "fail",
      })

      return acc
    }, {})
  }, [examResults])

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns: ColumnsType<ExamRow> = [
    {
      title: "Exam",
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
      render: (remarks) => <Tag color="green">{remarks}</Tag>,
    },
  ]



  return (
    <div
      style={{
        padding: 24,
        height: "100vh",
        overflow: "hidden",
      }}
    >

      <Card
        title={
          <Space>
            <UserOutlined /> Student Information
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Name">
            {examResults?.[0]?.student
              ? `${examResults[0].student.firstName ?? ""} ${examResults[0].student.middleName ?? ""} ${examResults[0].student.lastName ?? ""}`
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Course">
            {selectedCourse?.name ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Batch">
            {selectedBatch?.name ?? "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>


      <Card
        title={
          <Space>
            <TrophyOutlined /> Exam Results
          </Space>
        }
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
