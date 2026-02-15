'use client';

import { BookOutlined } from '@ant-design/icons';
import { Card, Collapse, Space, Statistic, Badge } from 'antd';

import { IExamSubmission } from '@/types/examSubmission';

import { ExamSubmissionSubjectSection } from './ExamSubmissionSubjectSection';


interface CourseSectionProps {
  courseId: number;
  submissions: IExamSubmission[];
  courseName?: string;
}


export const ExamSubmissionCourseSection = ({
  submissions,
}: CourseSectionProps) => {
  // const displayCourseName = courseName || COURSE_NAMES[courseId] || `Course ${courseId}`;

  // Group submissions by subject
  const submissionsBySubject = submissions.reduce(
    (acc, submission) => {
      const subjectId = submission.subjectId;
      if (!acc[subjectId]) {
        acc[subjectId] = [];
      }
      acc[subjectId].push(submission);
      return acc;
    },
    {} as Record<number, IExamSubmission[]>
  );

  const totalSubmissions = submissions.length;
  const submittedCount = submissions.filter((s) => s.status === 'submitted').length;
  const draftCount = submissions.filter((s) => s.status === 'draft').length;

  const items = Object.entries(submissionsBySubject).map(([subjectId, subs]) => ({
    key: subjectId,
    label: (
      <Space>
        <span>Subject {subjectId}</span>
        <Badge count={subs.length} color="#1890ff" />
      </Space>
    ),
    children: <ExamSubmissionSubjectSection subjectId={Number(subjectId)} submissions={subs} />,
  }));

  return (
    <Card
      className="mb-6"
    >
      <div className='flex justify-between px-2' style={{ marginBottom: 24 }}>
        <Statistic
          title="Total Submissions"
          value={totalSubmissions}
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

      {items.length > 0 ? (
        <Collapse items={items} defaultActiveKey={Object.keys(submissionsBySubject)} />
      ) : null}
    </Card>
  );
};
