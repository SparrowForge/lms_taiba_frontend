'use client';

import { DownloadOutlined, CreditCardOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Progress, Table, Button, Tag, Space, Row, Col, Statistic } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { UserType } from '@/enums/user-type.enum';

import { useAuth } from '@/hooks/useAuth';
import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections';

import { IFeePaymentCollection } from '@/types/feePaymentCollection';

import type { TableColumnsType } from 'antd';



const PaymentDetails = () => {
    const {id} = useParams()
    const {loadFeePaymentCollections, feePaymentCollections} = useFeePaymentCollections()
    const {user} = useAuth()
  // Calculated metrics
  const totalFees = 200000;
  const totalPaid = 72250; // 25000 + 47250
  const progressPercent = Math.round((totalPaid / totalFees) * 100);
  const onTimePayments = 2;
  const totalPayments = 6;

  useEffect(()=>{
    if(id || user.type === UserType.STUDENT){
      loadFeePaymentCollections({studentId: id ? id : user?.student?.id})
    }
  },[id, loadFeePaymentCollections, user?.student?.id, user.type])



  const columns: TableColumnsType<IFeePaymentCollection> = [
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 100,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 350,
      render: (text) => <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{text}</div>,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: 120,
    },
    {
      title: 'Amount (SAR)',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      width: 120,
      render: (value) => (
        <span style={{ color: value > 0 ? '#000' : '#52c41a', fontWeight: 500 }}>
          {value > 0 ? '+' : ''}{value?.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Balance (SAR)',
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
      render: (value) => <span style={{ fontWeight: 600 }}>{value?.toLocaleString()}</span>,
    },
  ];

  return (
    <div style={{  backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div >
        {/* Payment Progress Card */}
        <Card
          style={{ marginBottom: '24px' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
            <Col>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Payment Progress</h2>
              <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                {progressPercent}% of total fees paid or discounted
              </p>
            </Col>
            <Col>
              <Space direction="vertical" align="end" size={0}>
                <ArrowUpOutlined style={{ color: '#ff7a45', marginRight: '8px', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>On-Time Streak: {onTimePayments}/{totalPayments}</span>
              </Space>
            </Col>
          </Row>

          {/* Progress Bar */}
          <div style={{ marginBottom: '24px' }}>
            <Progress
              percent={progressPercent}
              strokeColor="#ff7a45"
              trailColor="#d9d9d9"
              showInfo={false}
              size={['100%', 18]}
            />
            <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '14px', fontWeight: 600 }}>
              {progressPercent}%
            </div>
          </div>

          {/* On-Time Payment Streak */}
          <Card
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Row justify="space-between" align="center" style={{ marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>On-Time Payment Streak</h3>
              <span style={{ fontSize: '12px', color: '#666' }}>{onTimePayments} of {totalPayments}</span>
            </Row>
            <Row gutter={8} style={{ marginBottom: '12px' }}>
              {Array.from({ length: totalPayments }).map((_, i) => (
                <Col key={i} xs={4}>
                  <div
                    style={{
                      height: '12px',
                      backgroundColor: i < onTimePayments ? '#52c41a' : '#d9d9d9',
                      borderRadius: '2px',
                    }}
                  />
                </Col>
              ))}
            </Row>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Complete 6 consecutive on-time payments to earn a free installment
            </p>
          </Card>
        </Card>

        {/* Fee Assignment Details Card */}
        <Card
          style={{ marginBottom: '24px' }}
          title="Fee Assignment Details"
          extra={<Button type="text">View Full Schedule</Button>}
          bodyStyle={{ padding: '24px' }}
        >
          <Row gutter={[32, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Template"
                value="Diploma Standard Fee"
                titleStyle={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}
                valueStyle={{ fontSize: '14px', fontWeight: 600, color: '#000' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Payment Schedule"
                value="Monthly Installments"
                titleStyle={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}
                valueStyle={{ fontSize: '14px', fontWeight: 600, color: '#000' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="VAT Status"
                value="No VAT (Saudi)"
                titleStyle={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}
                valueStyle={{ fontSize: '14px', fontWeight: 600, color: '#000' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Next Payment Due"
                value="1 Dec 2024"
                titleStyle={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}
                valueStyle={{ fontSize: '14px', fontWeight: 600, color: '#000' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Fee Statement Card */}
        <Card
          title="Fee Statement"
          extra={
            <Space>
              <Button icon={<DownloadOutlined />}>Download Statement</Button>
              <Button type="primary" danger icon={<CreditCardOutlined />}>
                Make Payment
              </Button>
            </Space>
          }
          bodyStyle={{ padding: '0' }}
        >
          <Table
            columns={columns}
            dataSource={feePaymentCollections}
            pagination={false}
            rowKey="id"
            size="middle"
            style={{ backgroundColor: '#fff' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default PaymentDetails;
