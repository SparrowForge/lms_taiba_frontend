import { Col, Row } from "antd";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardStartSection from "@/components/dashboard/newComponents/DashboardStartSection";


import { MainLayout } from "@/components/layout/MainLayout";
import LayoutDashboard from "@/components/layout/LayoutDashboard";

export default function HomePage() {


  return (
    <ProtectedRoute>
      <MainLayout>
        <DashboardStartSection />
        <LayoutDashboard/>
    
      </MainLayout>
    </ProtectedRoute>
  );
}
