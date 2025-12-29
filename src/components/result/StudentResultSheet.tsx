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
  Statistic,
  Row,
  Col,
  Badge,
  Progress,
} from "antd"
import { useParams } from "next/navigation"
import { useEffect,  } from "react"

import { useBatches } from "@/hooks/useBatches"
import { useCourses } from "@/hooks/useCourses"
import { useExamResults } from "@/hooks/useExamResults"

import type { ColumnsType } from "antd/es/table"


interface SubjectResult {
  key: string
  subject: string
  marks: number
  totalMarks: number
  grade: string
  status: "pass" | "fail"
}

export default function StudentResultSheet() {
  const { loadExamResults, examResults } = useExamResults()
  const { id } = useParams()

  const { loadCourse, selectedCourse } = useCourses()
  const { loadBatch, selectedBatch } = useBatches()

  useEffect(() => {
    if (examResults[0]?.student?.courseId) {
      loadCourse(examResults[0]?.student?.courseId)
    }
  }, [examResults, loadCourse])
  useEffect(() => {
    if (examResults[0]?.student?.batchId) {
      loadBatch(examResults[0]?.student?.batchId)
    }
  }, [examResults, loadBatch])

  useEffect(() => {
    if (id) {
      loadExamResults({ page: 1, limit: 99, studentId: id })
    }
  }, [loadExamResults, id])

  /* ---------------- API DATA ONLY ---------------- */

  const results: SubjectResult[] = (Array.isArray(examResults) ? examResults : []).map(
    (item: any) => ({
      key: String(item.id),
      subject: item.exam?.name,
      marks: item.marksObtained,
      totalMarks: item.exam?.marks,
      grade: item.grade,
      remarks: item.remarks,
      status: item.status === "published" ? "pass" : "fail",
    })
  )




  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0)
  const totalPossible = results.reduce((sum, r) => sum + r.totalMarks, 0)
  const percentage =
    totalPossible > 0 ? ((totalMarks / totalPossible) * 100).toFixed(2) : "0.00"

  const overallGrade =
    +percentage >= 90
      ? "A+"
      : +percentage >= 80
        ? "A"
        : +percentage >= 70
          ? "B+"
          : +percentage >= 60
            ? "B"
            : "C"



  const columns: ColumnsType<SubjectResult> = [
    {
      title: "Exam",
      dataIndex: "subject",
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
        return <Progress type="circle" percent={+percent.toFixed(1)} width={60} />
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
      render: (remarks) => <Tag color="blue">{remarks}</Tag>,
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

  return (
    <div style={{ padding: 24 }}>

      {/* Student Info (API ONLY) */}
      <Card
        title={
          <Space>
            <UserOutlined /> Student Information
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Name">
            {examResults[0]?.student
              ? `${examResults[0]?.student.firstName ?? ""} ${examResults[0]?.student.middleName ?? ""} ${examResults[0]?.student.lastName ?? ""}`
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

      {/* Summary */}
      {/* <Card
        title={
          <Space>
            <TrophyOutlined /> Overall Performance
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="Total Marks" value={totalMarks} suffix={`/ ${totalPossible}`} />
          </Col>
          <Col span={6}>
            <Statistic title="Percentage" value={percentage} suffix="%" />
          </Col>
          <Col span={6}>
            <Statistic title="Grade" value={overallGrade} />
          </Col>
          <Col span={6}>
            <Statistic
              title="Status"
              value={results.every(r => r.status === "pass") ? "PASSED" : "FAILED"}
            />
          </Col>
        </Row>
      </Card> */}

      {/* Results Table */}
      <Card title="Results">
        <Table
          bordered
          pagination={false}
          columns={columns}
          dataSource={results}
        />
      </Card>
    </div>
  )
}
