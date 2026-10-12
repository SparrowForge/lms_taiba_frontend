'use client';

import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import CourseDashboard from '@/components/coursesStudent/CourseDashboard';
import MyCoursesSection from '@/components/coursesStudent/MyCoursesSection';
import {MainLayout} from '@/components/layout/MainLayout';

interface SubjectDetailPageProps {
  params: Promise<{ id: string }>;
}

const SubjectDetailPage: React.FC<SubjectDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const subjectId = resolvedParams.id;

  const handleBack = () => {
    router.push('/dashboard/course');
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto p-3 md:p-6">
          {/* Header with Back Button */}
          <div className="mb-6">
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large">
              Back to Courses
            </Button>
          </div>

          {/* Subject Details */}
          <Card className="rounded-2xl shadow-sm">
            <CourseDashboard />
            <MyCoursesSection />
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SubjectDetailPage;
