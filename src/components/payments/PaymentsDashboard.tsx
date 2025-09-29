import {Col, Row} from 'antd';

import HeaderSection from './HeaderSection';
import PaymentMethods from './PaymentMethods';
import RecentInvoices from './RecentInvoices';
import RecentReceipts from './RecentReceipts';
import StatisticsCard from './StatisticsCard';

const PaymentsDashboard = () => {
  return (
    <div className="mx-10 my-10">
      {/* Top Banner */}
      <HeaderSection />
      {/* Stats Cards */}
      <StatisticsCard />

      {/* Content Section */}
      <Row gutter={[24, 24]} className="" style={{ width: '100%', minWidth: 0, height: '100%' }}>
        {/* Invoices */}
        <Col xs={24} lg={16} style={{ marginBottom: '40px' }}>
          <RecentInvoices />
        </Col>
        <Col xs={24} lg={8}>
          {/* Payment Methods */}
          <PaymentMethods />
          {/* Receipts */}
          <RecentReceipts />
        </Col>
      </Row>
    </div>
  );
};

export default PaymentsDashboard;
