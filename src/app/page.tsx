import {ProtectedRoute} from "@/components/auth/ProtectedRoute";
import {MainLayout} from "@/components/layout/MainLayout";
import {QuickActionsSection} from "@/components/dashboard/QuickActionsSection";
import {StatsSection} from "@/components/dashboard/StatsSection";
import {ActivitySection} from "@/components/dashboard/ActivitySection";
import {Col, Row} from "antd";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <StatsSection />
        <Row gutter={[24, 24]} className='px-6' style={{width: '100%', minWidth: 0}}>
          <Col xs={24} lg={16}>
            <ActivitySection />
          </Col>
          <Col xs={24} lg={8}>
            <QuickActionsSection />
          </Col>
        </Row>
      </MainLayout>
    </ProtectedRoute>
  )
}
