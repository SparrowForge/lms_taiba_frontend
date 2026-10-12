'use client'

import { Card, Collapse, Space, Statistic, Badge } from 'antd'

import { IExamSubmission } from '@/types/examSubmission'

import { ExamSubmissionSubjectSection } from './ExamSubmissionSubjectSection'

interface CourseSectionProps {
  submissions: IExamSubmission[]
}

export const ExamSubmissionCourseSection = ({ submissions }: CourseSectionProps) => {
  // Group by subjectId
  const submissionsBySubject = submissions.reduce((acc, submission) => {
    const subjectId = submission.subjectId
    if (!acc[subjectId]) acc[subjectId] = []
    acc[subjectId].push(submission)
    return acc
  }, {} as Record<number, IExamSubmission[]>)

  const totalSubmissions = submissions.length
  const submittedCount = submissions.filter(s => s.status === 'submitted').length
  const draftCount = submissions.filter(s => s.status === 'draft').length

  const items = Object.entries(submissionsBySubject).map(([subjectId, subs]) => {
    const subjectName = subs[0]?.subject?.name ?? `Subject ${subjectId}`

    return {
      key: subjectId,
      label: (
        <Space>
          <span>{subjectName}</span>
          <Badge count={subs.length} color="#1890ff" />
        </Space>
      ),
      children: <ExamSubmissionSubjectSection submissions={subs} />,
    }
  })

  return (
    <Card className="mb-6">
      <div className="flex justify-between px-2 mb-6 flex-wrap gap-2">
        <Statistic title="Total Submissions" value={totalSubmissions} suffix="exams" />
        <Statistic title="Submitted" value={submittedCount} valueStyle={{ color: '#52c41a' }} />
        <Statistic title="Draft" value={draftCount} valueStyle={{ color: '#faad14' }} />
      </div>

      {items.length > 0 && (
        <Collapse items={items} defaultActiveKey={items.map(i => i.key)} />
      )}
    </Card>
  )
}
