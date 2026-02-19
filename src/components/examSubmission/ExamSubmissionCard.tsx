'use client'

import { FileTextOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Tag, Descriptions, Space, Button } from 'antd'
import { useRouter } from 'next/navigation'

import { IExamSubmission } from '@/types/examSubmission'

interface Props {
  submission: IExamSubmission
}

export const ExamSubmissionCard = ({ submission }: Props) => {
  const router = useRouter()

  const statusColor: Record<string, string> = {
    submitted: 'green',
    draft: 'orange',
  }

  const studentName = [
    submission.student.firstName,
    submission.student.middleName,
    submission.student.lastName,
  ].filter(Boolean).join(' ')

  const answeredCount = submission.answers.filter(
    a => a.answerText || a.selectedOption !== null
  ).length

  return (
    <Card
      size="small"
      title={
        <div className="flex justify-between">
          <Space>
            <FileTextOutlined />
            {submission.exam.name}
          </Space>
          <Tag color={statusColor[submission.status]}>
            {submission.status.toUpperCase()}
          </Tag>
        </div>
      }
    >
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="Student">
          <Space>
            <UserOutlined />
            {studentName}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Application No">
          {submission.student.applicationNo}
        </Descriptions.Item>
        <Descriptions.Item label="Exam Type">
          {submission.exam.questionType.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Answered">
          {answeredCount} / {submission.answers.length}
        </Descriptions.Item>
        <Descriptions.Item label="Duration">
          {submission.exam.duration.minutes} minutes
        </Descriptions.Item>
      </Descriptions>

      <Space style={{ marginTop: 12 }}>
        <Button
          size="small"
          onClick={() =>
            router.push(`review?submissionId=${submission.id}`)
          }
        >
          Review Answers
        </Button>
      </Space>
    </Card>
  )
}
