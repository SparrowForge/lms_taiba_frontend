'use client'

import { Tabs, Empty } from 'antd'
import type { TabsProps } from 'antd'

import { IExamSubmission } from '@/types/examSubmission'
import { ExamSubmissionCourseSection } from './ExamSubmissionCourseSection'

interface Props {
  submissions: IExamSubmission[]
}

export const ExamSubmissionExamTabs = ({ submissions }: Props) => {
  if (!submissions || submissions.length === 0) {
    return <Empty description="No exam submissions found" />
  }

  // 🔹 Group by examId
  const submissionsByExam = submissions.reduce((acc, submission) => {
    const examId = submission.exam.id
    if (!acc[examId]) acc[examId] = []
    acc[examId].push(submission)
    return acc
  }, {} as Record<number, IExamSubmission[]>)

  const items: TabsProps['items'] = Object.values(submissionsByExam).map(
    (examSubmissions) => {
      const exam = examSubmissions[0].exam

      return {
        key: String(exam.id),
        label: exam.name,
        children: (
          <ExamSubmissionCourseSection submissions={examSubmissions} />
        ),
      }
    }
  )

  return <Tabs items={items} />
}
