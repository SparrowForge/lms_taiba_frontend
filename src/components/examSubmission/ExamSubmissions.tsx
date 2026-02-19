'use client'

import { Spin } from 'antd'

import { IExamSubmission } from '@/types/examSubmission'

import { ExamSubmissionExamTabs } from './ExamSubmissionExamTab'


interface Props {
  data: IExamSubmission[]
  loading?: boolean
}

export const ExamSubmissions = ({ data, loading }: Props) => {
  if (loading) return <Spin size="large" />

  return (
    <div style={{ padding: 24 }}>
      <ExamSubmissionExamTabs submissions={data} />
    </div>
  )
}
