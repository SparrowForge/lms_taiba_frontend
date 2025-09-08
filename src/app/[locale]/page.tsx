import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import DashboardStartSection from '@/components/dashboard/newComponents/DashboardStartSection';
import LayoutDashboard from '@/components/layout/LayoutDashboard';
import {MainLayout} from '@/components/layout/MainLayout';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto">
          <DashboardStartSection />
          <LayoutDashboard />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
