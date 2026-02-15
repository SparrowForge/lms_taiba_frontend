'use client';

import { BookOutlined } from '@ant-design/icons';
import { Empty, Space, Statistic } from 'antd';



import { IExamSubmission } from '@/types/examSubmission';

import { ExamSubmissionCard } from './ExamSubmissionCard';


interface SubjectSectionProps {
  subjectId: number;
  submissions: IExamSubmission[];
}

const SUBJECT_NAMES: Record<number, string> = {
  1: 'Subject 1 - Mathematics',
  2: 'Subject 2 - Physics',
  3: 'Subject 3 - Chemistry',
  // Add more subjects as needed
};

export const ExamSubmissionSubjectSection = ({ subjectId, submissions }: SubjectSectionProps) => {

  const subjectName = SUBJECT_NAMES[subjectId] || `Subject ${subjectId}`;
  const submittedCount = submissions.filter((s) => s.status === 'submitted').length;
  const draftCount = submissions.filter((s) => s.status === 'draft').length;


  return (
    <div className="mb-6">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1890ff' }}>
              {subjectName}
            </span>
          </div>
          <div className="flex justify-between">
            <Statistic
              title="Total Submissions"
              value={submissions.length}
              suffix="exams"
            />
            <Statistic
              title="Submitted"
              value={submittedCount}
              valueStyle={{ color: '#52c41a' }}
              suffix="exams"
            />
            <Statistic
              title="Draft"
              value={draftCount}
              valueStyle={{ color: '#faad14' }}
              suffix="exams"
            />
          </div>
        </Space>
      </div>

      {submissions.length > 0 ? (
        <div className="space-y-2 grid grid-cols-2 gap-4">
          {submissions.map((submission) => (
            <ExamSubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      ) : (
        <Empty description="No submissions found for this subject" />
      )}
    </div>
  );
};
