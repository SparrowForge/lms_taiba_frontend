'use client'

import { BookOutlined } from '@ant-design/icons'
import { Empty, Space, Statistic } from 'antd'

import { IExamSubmission } from '@/types/examSubmission'

import { ExamSubmissionCard } from './ExamSubmissionCard'

interface SubjectSectionProps {
  submissions: IExamSubmission[]
}

export const ExamSubmissionSubjectSection = ({ submissions }: SubjectSectionProps) => {
  if (submissions.length === 0) {
    return <Empty description="No submissions found for this subject" />
  }

  const subject = submissions[0].subject
  const submittedCount = submissions.filter(s => s.status === 'submitted').length
  const draftCount = submissions.filter(s => s.status === 'draft').length

  return (
    <div className="mb-6">
      {/* Subject Header */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div className="flex items-center gap-3">
            <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1890ff' }}>
              {subject.name}
            </span>
          </div>

          <div className="flex justify-between">
            <Statistic title="Total Submissions" value={submissions.length} />
            <Statistic title="Submitted" value={submittedCount} valueStyle={{ color: '#52c41a' }} />
            <Statistic title="Draft" value={draftCount} valueStyle={{ color: '#faad14' }} />
          </div>
        </Space>
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-2 gap-4">
        {submissions.map(submission => (
          <ExamSubmissionCard key={submission.id} submission={submission} />
        ))}
      </div>
    </div>
  )
}
