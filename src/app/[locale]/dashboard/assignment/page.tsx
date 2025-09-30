import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

const AssignmentMainDashboard = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">

        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AssignmentMainDashboard;
