'use client';

import {  FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Tag, Descriptions, Space, Button } from 'antd';
import { useRouter } from 'next/navigation';

import { IExamSubmission } from '@/types/examSubmission';


interface SubmissionCardProps {
  submission: IExamSubmission;
}

export const ExamSubmissionCard = ({ submission }: SubmissionCardProps) => {
  const router = useRouter()
  const statusColor: Record<string, string> = {
    submitted: 'green',
    draft: 'orange',
    pending: 'blue',
    failed: 'red',
  };

  const getStudentName = () => {
    const { firstName, middleName, lastName } = submission.student;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  };

  const getAnsweredQuestionsCount = () => {
    return submission.answers.filter(
      (ans) => ans.answerText !== null || ans.selectedOption !== null
    ).length;
  };

  const handleReviewExams = (submissionId: number) => {
    return router.push(`exam-submission/review?submissionId=${submissionId}`)
  }

  return (
    <Card
      size="small"
      className="mb-4"
      title={
        <div className='flex justify-between'>
          <div>
            <FileTextOutlined />
            <span className='ml-4'>{submission.exam.name}</span>
          </div>
          <Tag color={statusColor[submission.status] || 'default'}>
            {submission.status.toUpperCase()}
          </Tag>
        </div>
      }
    >
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="Student Name">
          <Space>
            <UserOutlined />
            {getStudentName()}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Student ID">
          {submission.student.applicationNo}
        </Descriptions.Item>
        <Descriptions.Item label="Exam Type">
          {submission.exam.questionType.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Total Marks">
          {submission.exam.marks}
        </Descriptions.Item>
        <Descriptions.Item label="Questions Answered">
          {getAnsweredQuestionsCount()} / {submission.answers.length}
        </Descriptions.Item>
        <Descriptions.Item label="Duration">
          {submission.exam.duration.minutes} minutes
        </Descriptions.Item>
      </Descriptions>
      <Space style={{ marginTop: 16 }}>
        <Button type="primary" size="small">
          View Details
        </Button>
        <Button onClick={() => handleReviewExams(submission.id)} size="small">Review Answers</Button>
      </Space>
    </Card>
  );
};
