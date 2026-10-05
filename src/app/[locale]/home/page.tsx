'use client';

import { UserType } from '@/enums/user-type.enum';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { MainLayout } from '@/components/layout/MainLayout';

import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
          {user?.type === UserType.ADMIN && <AdminDashboard />}
          {user?.type === UserType.STUDENT && <StudentDashboard />}
          {user?.type === UserType.FACULTY && <FacultyDashboard />}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
