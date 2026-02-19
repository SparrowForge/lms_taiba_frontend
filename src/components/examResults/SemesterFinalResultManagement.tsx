'use client'

import { Table, InputNumber, Card, Button } from 'antd'
import { useEffect, useState } from 'react'

import { useExams } from '@/hooks/useExams'
import { useStudents } from '@/hooks/useStudents'

import { IExam } from '@/types/exam'
import { IStudent } from '@/types/student'

interface Student {
  id: number
  name: string
  registrationNo: string
}


interface Props {
  batch: number | undefined
  subject: number | undefined
}

export default function SemesterFinalResultManagement({
  batch, subject
}: Props) {
  const { students, loadStudents } = useStudents()
  const { exams, loadExams } = useExams()

  useEffect(() => {
    if (batch) {
      loadStudents({ page: 1, limit: 99, batchId: batch })
    }
  }, [batch, loadStudents])

  useEffect(() => {
    if (batch && subject) {
      loadExams({ page: 1, limit: 99, batchId: batch, subjectId: subject })
    }
  }, [batch, loadExams, subject])
  const [grades, setGrades] = useState<Record<number, Record<number, number>>>(
    {}
  )

  const handleChange = (
    studentId: number,
    examId: number,
    value: number | null
  ) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [examId]: value ?? 0,
      },
    }))
  }

  const columns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'student',
      fixed: 'left',
      width: 240,
      render: (_: any, record: IStudent) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#888' }}>
            {record.firstName} {record.lastName}
          </div>
        </div>
      ),
    },

    ...exams.map((exam: IExam) => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          {exam.name}
          <br />
          <span style={{ fontSize: 12 }}>/ Parcentage Marks</span>
        </div>
      ),
      dataIndex: `exam_${exam.id}`,
      key: `exam_${exam.id}`,
      align: 'center' as const,
      render: (_: any, record: Student) => (
        <InputNumber
          min={0}
          max={exam.marks}
          value={grades[record.id]?.[exam.id]}
          onChange={(value) =>
            handleChange(record.id, exam.id, value)
          }
        />
      ),
    })),

    {
      title: 'Total',
      key: 'total',
      align: 'center' as const,
      render: (_: any, record: Student) =>
        exams.reduce(
          (sum, exam) => sum + (grades[record.id]?.[exam.id] || 0),
          0
        ),
    },
  ]

  const handleSubmit = () => {
    const submitData = students.map((student) => ({
      studentId: student.id,

      attendance: {
        percentage: 10,
      },

      exams: exams.map((exam) => ({
        id: exam.id,
        percentage: grades[student.id]?.[exam.id] || 0,
      })),

      class: {},

      assignment: [],
    }))

    console.log('SUBMIT DATA 👉', submitData)

    
  }


  return (
    <Card title="Semester Final Results"
      extra={
        <Button type="primary" onClick={handleSubmit}>
          Submit Results
        </Button>
      }>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={students}
        pagination={false}

        bordered
      />
    </Card>
  )
}
