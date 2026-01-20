'use client';

import { UserType } from '@/enums/user-type.enum';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import FacultyCourse from '@/components/dashboard/course/FacultyCourse';
import StudentCourse from '@/components/dashboard/course/StudentCourse';
import {MainLayout} from '@/components/layout/MainLayout';

import { useAuth } from '@/hooks/useAuth'; 




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
