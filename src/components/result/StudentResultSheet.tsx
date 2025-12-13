"use client"

import { TrophyOutlined, BookOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons"
import { Card, Descriptions, Table, Tag, Space, Divider, Statistic, Row, Col, Badge, Progress } from "antd"

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
  // Sample student data
  const studentInfo = {
    name: "John Michael Smith",
    rollNumber: "STU2024001",
    class: "10th Grade - Section A",
    academicYear: "2023-2024",
    examType: "Final Examination",
    dateOfBirth: "15th March 2009",
    fatherName: "Robert Smith",
    institution: "Springfield High School",
  }

  // Sample results data
  const results: SubjectResult[] = [
    { key: "1", subject: "Mathematics", marks: 85, totalMarks: 100, grade: "A", status: "pass" },
    { key: "2", subject: "Physics", marks: 78, totalMarks: 100, grade: "B+", status: "pass" },
    { key: "3", subject: "Chemistry", marks: 82, totalMarks: 100, grade: "A", status: "pass" },
    { key: "4", subject: "Biology", marks: 90, totalMarks: 100, grade: "A+", status: "pass" },
    { key: "5", subject: "English", marks: 88, totalMarks: 100, grade: "A", status: "pass" },
    { key: "6", subject: "Computer Science", marks: 92, totalMarks: 100, grade: "A+", status: "pass" },
  ]

  const totalMarks = results.reduce((sum, result) => sum + result.marks, 0)
  const totalPossible = results.reduce((sum, result) => sum + result.totalMarks, 0)
  const percentage = ((totalMarks / totalPossible) * 100).toFixed(2)
  const overallGrade =
    percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B+" : percentage >= 60 ? "B" : "C"

  const columns: ColumnsType<SubjectResult> = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text) => (
        <Space>
          <BookOutlined style={{ color: "#1890ff" }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "Marks Obtained",
      dataIndex: "marks",
      key: "marks",
      align: "center",
      render: (marks, record) => `${marks} / ${record.totalMarks}`,
    },
    {
      title: "Percentage",
      key: "percentage",
      align: "center",
      render: (_, record) => {
        const percent = ((record.marks / record.totalMarks) * 100).toFixed(1)
        return (
          <Progress
            type="circle"
            percent={Number.parseFloat(percent)}
            width={60}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
        )
      },
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      align: "center",
      render: (grade) => {
        const color = grade.includes("A+")
          ? "green"
          : grade.includes("A")
            ? "blue"
            : grade.includes("B")
              ? "cyan"
              : "orange"
        return (
          <Tag color={color} style={{ fontSize: "14px", padding: "4px 12px" }}>
            {grade}
          </Tag>
        )
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Badge status={status === "pass" ? "success" : "error"} text={status === "pass" ? "Passed" : "Failed"} />
      ),
    },
  ]

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Section */}
        <Card style={{ marginBottom: "24px", textAlign: "center" }} styles={{ body: { padding: "32px" } }}>
          <h1 style={{ margin: 0, fontSize: "32px", color: "#1890ff" }}>{studentInfo.institution}</h1>
          <p style={{ fontSize: "18px", color: "#666", margin: "8px 0 0 0" }}>Student Result Sheet</p>
        </Card>

        {/* Student Information */}
        <Card
          title={
            <Space>
              <UserOutlined />
              <span>Student Information</span>
            </Space>
          }
          style={{ marginBottom: "24px" }}
        >
          <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
            <Descriptions.Item label="Student Name">{studentInfo.name}</Descriptions.Item>
            <Descriptions.Item label="Roll Number">{studentInfo.rollNumber}</Descriptions.Item>
            <Descriptions.Item label="Class">{studentInfo.class}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{studentInfo.dateOfBirth}</Descriptions.Item>
            <Descriptions.Item label="Father's Name">{studentInfo.fatherName}</Descriptions.Item>
            <Descriptions.Item label="Academic Year">
              <Space>
                <CalendarOutlined />
                {studentInfo.academicYear}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Exam Type" span={2}>
              <Tag color="blue">{studentInfo.examType}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Overall Performance Summary */}
        <Card
          title={
            <Space>
              <TrophyOutlined />
              <span>Overall Performance</span>
            </Space>
          }
          style={{ marginBottom: "24px" }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Statistic
                title="Total Marks"
                value={totalMarks}
                suffix={`/ ${totalPossible}`}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic title="Percentage" value={percentage} suffix="%" valueStyle={{ color: "#3f8600" }} />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic title="Overall Grade" value={overallGrade} valueStyle={{ color: "#cf1322" }} />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic title="Result Status" value="PASSED" valueStyle={{ color: "#52c41a", fontSize: "20px" }} />
            </Col>
          </Row>
        </Card>

        {/* Subject-wise Results */}
        <Card
          title={
            <Space>
              <BookOutlined />
              <span>Subject-wise Results</span>
            </Space>
          }
          style={{ marginBottom: "24px" }}
        >
          <Table
            columns={columns}
            dataSource={results}
            pagination={false}
            bordered
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row style={{ backgroundColor: "#fafafa" }}>
                  <Table.Summary.Cell index={0}>
                    <strong>Total</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="center">
                    <strong>
                      {totalMarks} / {totalPossible}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="center">
                    <Tag color="green" style={{ fontSize: "14px", padding: "4px 12px" }}>
                      {percentage}%
                    </Tag>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">
                    <Tag color="blue" style={{ fontSize: "14px", padding: "4px 12px" }}>
                      {overallGrade}
                    </Tag>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">
                    <Badge status="success" text="All Passed" />
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>

        {/* Remarks Section */}
        <Card title="Remarks" style={{ marginBottom: "24px" }}>
          <p style={{ margin: 0, lineHeight: "1.8" }}>
            <strong>Performance Summary:</strong> The student has demonstrated excellent academic performance across all
            subjects with an overall percentage of {percentage}%. Special commendation for outstanding performance in
            Biology and Computer Science.
          </p>
          <Divider />
          <Row justify="space-between" style={{ marginTop: "32px" }}>
            <Col>
              <div style={{ textAlign: "center" }}>
                <Divider style={{ width: "200px", margin: "0 auto 8px" }} />
                <p style={{ margin: 0 }}>Class Teacher</p>
              </div>
            </Col>
            <Col>
              <div style={{ textAlign: "center" }}>
                <Divider style={{ width: "200px", margin: "0 auto 8px" }} />
                <p style={{ margin: 0 }}>Principal</p>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#999", padding: "16px 0" }}>
          <p style={{ margin: 0 }}>This is a computer-generated result sheet. No signature is required.</p>
          <p style={{ margin: "4px 0 0 0" }}>
            Generated on:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
