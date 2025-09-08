import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import LMSMainComponent from '@/components/lms/LMSMainComponent';

const LMSDashboard = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[600px] overflow-y-auto">
          <LMSMainComponent />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default LMSDashboard;
