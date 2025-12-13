"use client"

import { useState } from "react"
import { Table, InputNumber, Button, message, Space, Typography, Card } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"

const { Title, Text } = Typography

interface Student {
  key: string
  id: number
  name: string
  marks: number | null
  grade: string
}

const calculateGrade = (marks: number | null): string => {
  if (marks === null || marks < 0) return "-"
  if (marks >= 90) return "A+"
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  return "F"
}

export default function StudentResultAssign() {
  const [students, setStudents] = useState<Student[]>([
    { key: "1", id: 1, name: "Rahim Ahmed", marks: null, grade: "-" },
    { key: "2", id: 2, name: "Karim Khan", marks: null, grade: "-" },
  ])

  const [loading, setLoading] = useState(false)

  const handleMarksChange = (key: string, marks: number | null) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.key === key ? { ...s, marks, grade: calculateGrade(marks) } : s,
      ),
    )
  }

  const addStudent = () => {
    const nextId = students.length + 1
    setStudents([
      ...students,
      {
        key: String(nextId),
        id: nextId,
        name: `Student ${nextId}`,
        marks: null,
        grade: "-",
      },
    ])
  }

  const deleteStudent = (key: string) => {
    if (students.length === 1) {
      message.warning("At least one student is required")
      return
    }
    setStudents(students.filter((s) => s.key !== key))
  }

  const handleSubmit = async () => {
    const invalid = students.some((s) => s.marks === null)
    if (invalid) {
      message.error("Please enter marks for all students")
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success("Student results submitted successfully")
      console.log("Submitted:", students)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<Student> = [
    {
      title: "S.No",
      dataIndex: "id",
      align: "center",
      width: 80,
    },
    {
      title: "Student Name",
      dataIndex: "name",
    },
    {
      title: "Marks",
      dataIndex: "marks",
      width: 160,
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
      width: 100,
      render: (grade) => <Text strong>{grade}</Text>,
    },
    {
      title: "Action",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteStudent(record.key)}
        />
      ),
    },
  ]

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={3}>Student Marks Entry</Title>

        <Table
          columns={columns}
          dataSource={students}
          pagination={false}
          bordered
        />

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button type="dashed" icon={<PlusOutlined />} onClick={addStudent}>
            Add Student
          </Button>

          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Submit Results
          </Button>
        </Space>
      </Space>
    </Card>
  )
}
