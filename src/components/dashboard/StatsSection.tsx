'use client';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';

import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

export const StatsSection = () => {
  const { getUserFullName } = useAuth();

  const statsData = [
    {
      title: 'Total Students',
      value: 1128,
      prefix: <UserOutlined />,
      color: '#3f8600',
      change: '+12%',
      changeType: 'up' as const,
    },
    {
      title: 'Active Courses',
      value: 93,
      prefix: <BookOutlined />,
      color: '#1890ff',
      change: '+8%',
      changeType: 'up' as const,
    },
    {
      title: 'Teachers',
      value: 45,
      prefix: <TeamOutlined />,
      color: '#722ed1',
      change: '+5%',
      changeType: 'up' as const,
    },
    {
      title: 'Assignments',
      value: 256,
      prefix: <FileTextOutlined />,
      color: '#fa8c16',
      change: '-3%',
      changeType: 'down' as const,
    },
  ];

  return (
    <div className="p-3 md:p-6 bg-gray-50">
      {/* Welcome Section */}
      <div className="mb-8">
        <Title level={2} className="mb-2 text-gray-800">
          Welcome back, {getUserFullName()}! 👋
        </Title>
        <Text className="text-gray-600 text-base">
          Here&apos;s what&apos;s happening with your LMS today.
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              className="shadow-sm hover:shadow-md transition-shadow duration-300 border-0"
              styles={{ body: { padding: '24px' } }}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <div style={{ color: stat.color, fontSize: '24px' }}>{stat.prefix}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {stat.changeType === 'up' ? (
                      <ArrowUpOutlined className="text-green-500 mr-1" />
                    ) : (
                      <ArrowDownOutlined className="text-red-500 mr-1" />
                    )}
                    <Text
                      className={stat.changeType === 'up' ? 'text-green-500' : 'text-red-500'}
                      style={{ fontSize: '12px' }}
                    >
                      {stat.change}
                    </Text>
                  </div>
                </div>
              </div>
              <Statistic
                title={<Text className="text-gray-600 text-sm">{stat.title}</Text>}
                value={stat.value}
                valueStyle={{
                  color: stat.color,
                  fontSize: '28px',
                  fontWeight: 'bold',
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
