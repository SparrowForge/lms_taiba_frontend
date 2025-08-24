import {Col, Row} from 'antd';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {ActivitySection} from '@/components/dashboard/ActivitySection';
import {QuickActionsSection} from '@/components/dashboard/QuickActionsSection';
import {StatsSection} from '@/components/dashboard/StatsSection';
import {MainLayout} from '@/components/layout/MainLayout';
import DashboardStartSection from '@/components/dashboard/newComponents/DashboardStartSection';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <DashboardStartSection/>
        <StatsSection />
        <Row gutter={[24, 24]} className="px-6" style={{ width: '100%', minWidth: 0 }}>
          <Col xs={24} lg={16}>
            <ActivitySection />
          </Col>
          <Col xs={24} lg={8}>
            <QuickActionsSection />
          </Col>
        </Row>
      </MainLayout>
    </ProtectedRoute>
  );
}
