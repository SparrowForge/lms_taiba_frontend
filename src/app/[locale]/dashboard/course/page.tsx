'use client';
import { useAuth } from '@/hooks/useAuth'; 

import { UserType } from '@/enums/user-type.enum';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import StudentCourse from '@/components/dashboard/course/StudentCourse';
import FacultyCourse from '@/components/dashboard/course/FacultyCourse';




const CoursesStudent = () => {
  const {user} = useAuth()
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
          {user?.type === UserType.STUDENT && <StudentCourse />}
          {user?.type === UserType.FACULTY && <FacultyCourse />}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CoursesStudent;
