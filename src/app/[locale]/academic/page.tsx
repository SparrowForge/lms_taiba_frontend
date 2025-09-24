import AcademicDashboard from '@/components/academic/AcademicDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

const AcademicMainDashboard = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
         <AcademicDashboard/>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AcademicMainDashboard;
