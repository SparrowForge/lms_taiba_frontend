'use client';

import { Layout, Empty, Space, Spin } from 'antd';

import { IExamSubmission } from '@/types/examSubmission';

import { ExamSubmissionCourseSection } from './ExamSubmissionCourseSection';




interface ExamSubmissionsPageProps {
  data: IExamSubmission[];
  loading?: boolean;
}

export const ExamSubmissions = ({ data, loading = false }: ExamSubmissionsPageProps) => {
  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Loading submissions..." />
      </Layout>
    );
  }

  // Group submissions by course
  const submissionsByCourse = data.reduce(
    (acc, submission) => {
      const courseId = submission.courseId;
      if (!acc[courseId]) {
        acc[courseId] = [];
      }
      acc[courseId].push(submission);
      return acc;
    },
    {} as Record<number, IExamSubmission[]>
  );

  const courseIds = Object.keys(submissionsByCourse).sort((a, b) => Number(a) - Number(b));

  return (
    <div style={{ height: '100vh', backgroundColor: '#f5f5f5', overflowY: "auto", paddingBottom:60 }}>
      <Layout.Content style={{ padding: '24px', margin: '0 auto', width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {courseIds.length > 0 ? (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {courseIds.map((courseId) => (
                <ExamSubmissionCourseSection
                  key={courseId}
                  courseId={Number(courseId)}
                  submissions={submissionsByCourse[Number(courseId)]}
                />
              ))}
            </Space>
          ) : (
            <Empty
              description="No exam submissions found"
              style={{ marginTop: 48 }}
            />
          )}
        </Space>
      </Layout.Content>
    </div>
  );
};
