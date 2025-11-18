import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';

const ProfileMainDashboard = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto"></div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfileMainDashboard;
