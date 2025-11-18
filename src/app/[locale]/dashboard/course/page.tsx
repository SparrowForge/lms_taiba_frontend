'use client';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import StudentCourse from '@/components/dashboard/course/StudentCourse';
import {MainLayout} from '@/components/layout/MainLayout';

const CoursesStudent = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
          <StudentCourse />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CoursesStudent;
