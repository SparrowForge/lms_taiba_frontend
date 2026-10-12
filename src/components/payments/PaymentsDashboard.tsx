'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Avatar,
  Card,
  Col,
  Collapse,
  Divider,
  Empty,
  Flex,
  List,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';

import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';

const { Title, Text } = Typography;

export default function PaymentsDashboard() {
  const { user } = useAuth();
  const { loadStudentWithFeeInfo, studentWithFeeInfo } = useStudents();

  const [selectedInstallment, setSelectedInstallment] = useState<number | null>(null);

  useEffect(() => {
    if (user?.student?.id) {
      loadStudentWithFeeInfo(user.student.id);
    }
  }, [loadStudentWithFeeInfo, user?.student?.id]);

  const calculatedData = useMemo(() => {
    if (!studentWithFeeInfo) {
      return {
        totalPaid: 0,
        totalDue: 0,
        totalFees: 0,
        paymentPercentage: 0,
        installmentStatus: {} as Record<string, string>,
      };
    }

    const totalPaid = studentWithFeeInfo.paymentCollections.reduce(
      (sum, payment) => sum + payment.amountPaid,
      0,
    );

    const totalFees = studentWithFeeInfo?.feeStructure?.totalFees ?? 0;

    const totalDue = Math.max(0, totalFees - totalPaid);

    const paymentPercentage = totalFees
      ? Number(((totalPaid / totalFees) * 100).toFixed(1))
      : 0;

    const installmentStatus: Record<string, string> = {};

    studentWithFeeInfo.paymentCollections.forEach((payment) => {
      payment.paymentDetails.forEach((detail) => {
        if (detail.balanceAmount === 0) {
          installmentStatus[detail.feeTitle] = 'paid';
        } else if (detail.amountPaid > 0) {
          installmentStatus[detail.feeTitle] = 'partial';
        } else {
          installmentStatus[detail.feeTitle] = 'pending';
        }
      });
    });

    return {
      totalPaid,
      totalDue,
      totalFees,
      paymentPercentage,
      installmentStatus,
    };
  }, [studentWithFeeInfo]);

  const formatCurrency = (amount?: number) => {
    const currency = studentWithFeeInfo?.feeStructure?.currency ?? '';
    return `${currency} ${(amount ?? 0).toLocaleString()}`;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'paid':
        return <Tag color="success">Paid</Tag>;

      case 'partial':
        return <Tag color="warning">Partial</Tag>;

      default:
        return <Tag color="default">Pending</Tag>;
    }
  };

  if (!studentWithFeeInfo) {
    return (
      <div className="p-3 md:p-6">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 lg:p-8">
      <div className="">
        {/* Header */}
        <Card
          bordered={false}
          className="mb-6 shadow-sm rounded-2xl"
          bodyStyle={{ padding: 24, marginBottom: 20 }}
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={20}>
            <Space size={16} align="center">
              <Avatar
                size={64}
                icon={<UserOutlined />}
                className="bg-blue-500"
              />

              <div>
                <Title level={3} className="!mb-1">
                  Course Fee Dashboard
                </Title>

                <Text type="secondary">
                  {studentWithFeeInfo?.student?.firstName}{' '}
                  {studentWithFeeInfo?.student?.lastName}
                </Text>

                <br />

                <Text strong>
                  {studentWithFeeInfo?.student?.course?.name ?? 'No Course'}
                </Text>
              </div>
            </Space>

            <div className="min-w-[220px]">
              <Text type="secondary">Overall Payment Progress</Text>

              <Progress
                percent={calculatedData.paymentPercentage}
                strokeColor="#1677ff"
                size="small"
              />
            </div>
          </Flex>
        </Card>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl"
            >
              <Statistic
                title="Total Due"
                value={calculatedData.totalDue}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />

              <Divider />

              <Text type="secondary">
                Remaining from total fees of{' '}
                {formatCurrency(calculatedData.totalFees)}
              </Text>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl"
            >
              <Statistic
                title="Total Paid"
                value={calculatedData.totalPaid}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<CheckCircleFilled />}
                valueStyle={{ color: '#52c41a' }}
              />

              <Divider />

              <Text type="secondary">
                {calculatedData.paymentPercentage}% completed
              </Text>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl"
            >
              <Statistic
                title="Total Fees"
                value={calculatedData.totalFees}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarCircleOutlined />}
                valueStyle={{ color: '#1677ff' }}
              />

              <Divider />

              <Text type="secondary">
                Full academic payment structure
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Installments */}
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl"
              title={
                <Space>
                  <CreditCardOutlined />
                  <span>Installment Schedule</span>
                </Space>
              }
            >
              {studentWithFeeInfo?.feeStructure?.installmentPlans?.length ? (
                <Collapse
                  accordion
                  ghost
                  activeKey={selectedInstallment ?? undefined}
                  onChange={(key) =>
                    setSelectedInstallment(Number(key))
                  }
                  items={studentWithFeeInfo.feeStructure.installmentPlans.map(
                    (plan) => {
                      const status =
                        calculatedData.installmentStatus[
                          plan.paymentLabel
                        ] || 'pending';

                      return {
                        key: plan.id,
                        label: (
                          <Flex
                            justify="space-between"
                            align="center"
                            wrap="wrap"
                            gap={12}
                          >
                            <Space direction="vertical" size={0}>
                              <Text strong>{plan.paymentLabel}</Text>

                              <Text type="secondary">
                                <CalendarOutlined /> Due:{' '}
                                {formatDate(plan.dueDate)}
                              </Text>
                            </Space>

                            <Space size={12}>
                              <Text strong>
                                {formatCurrency(plan.amount)}
                              </Text>

                              {getStatusTag(status)}
                            </Space>
                          </Flex>
                        ),

                        children: (
                          <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                              <Card size="small">
                                <Statistic
                                  title="Installment Amount"
                                  value={plan.amount}
                                  formatter={(value) =>
                                    formatCurrency(Number(value))
                                  }
                                />
                              </Card>
                            </Col>

                            <Col xs={24} md={12}>
                              <Card size="small">
                                <Statistic
                                  title="Due Date"
                                  value={formatDate(plan.dueDate)}
                                  prefix={<CalendarOutlined />}
                                />
                              </Card>
                            </Col>
                          </Row>
                        ),
                      };
                    },
                  )}
                />
              ) : (
                <Empty description="No installment plans found" />
              )}
            </Card>
          </Col>

          {/* Payment History */}
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl"
              title={
                <Space>
                  <FileTextOutlined />
                  <span>Payment History</span>
                </Space>
              }
            >
              {studentWithFeeInfo?.paymentCollections?.length ? (
                <List
                  itemLayout="vertical"
                  dataSource={studentWithFeeInfo.paymentCollections}
                  renderItem={(payment) => (
                    <List.Item
                      key={payment.id}
                      className="!px-0"
                    >
                      <Flex justify="space-between" align="start">
                        <div>
                          <Text strong>
                            {formatCurrency(payment.amountPaid)}
                          </Text>

                          <br />

                          <Text type="secondary">
                            {formatDate(payment.paymentDate)}
                          </Text>
                        </div>

                        <Tag
                          color={
                            payment.status === 'paid'
                              ? 'success'
                              : payment.status === 'partial'
                                ? 'warning'
                                : 'default'
                          }
                        >
                          {payment.status.toUpperCase()}
                        </Tag>
                      </Flex>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No payment history found" />
              )}
            </Card>

            {/* Notice Card */}
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl mt-4"
              style={{marginTop:20}}
            >
              <Alert
                type="info"
                showIcon
                message="Payment Reminder"
                description="Please complete upcoming installment payments before the due date to avoid penalties."
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}