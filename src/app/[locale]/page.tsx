import {Col, Row} from 'antd';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {ActivitySection} from '@/components/dashboard/ActivitySection';
import DashboardStartSection from '@/components/dashboard/newComponents/DashboardStartSection';
import {QuickActionsSection} from '@/components/dashboard/QuickActionsSection';
// import {StatsSection} from '@/components/dashboard/StatsSection';
import {MainLayout} from '@/components/layout/MainLayout';
import RecentAnnouncenments from '@/components/dashboard/newComponents/RecentAnnouncenments';
import WeeklySchedule from '@/components/dashboard/newComponents/WeeklySchedule';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <DashboardStartSection/>
        {/* <StatsSection /> */}
        <Row gutter={[24, 24]} className="pl-6" style={{ width: '100%', minWidth: 0, height:"100%" }}>
          <Col xs={24} lg={16}>
          <WeeklySchedule/>
            {/* <ActivitySection /> */}
          </Col>
          <Col xs={24} lg={8}>
          <RecentAnnouncenments/>
            <QuickActionsSection />
          </Col>
        </Row>
      </MainLayout>
    </ProtectedRoute>
  );
}
