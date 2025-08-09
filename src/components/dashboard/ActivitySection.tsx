'use client';

import {EyeOutlined} from '@ant-design/icons';
import {Avatar, Button, Card, List, Typography} from 'antd';

const { Text } = Typography;

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  course: string;
  time: string;
  avatar: string;
}

export const ActivitySection = () => {
  const recentActivities: ActivityItem[] = [
    {
      id: 1,
      user: 'Ahmed Hassan',
      action: 'enrolled in',
      course: 'Advanced Mathematics',
      time: '2 minutes ago',
      avatar: 'AH',
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      action: 'submitted assignment for',
      course: 'Physics 101',
      time: '15 minutes ago',
      avatar: 'SJ',
    },
    {
      id: 3,
      user: 'Mohammed Ali',
      action: 'completed',
      course: 'English Literature',
      time: '1 hour ago',
      avatar: 'MA',
    },
    {
      id: 4,
      user: 'Fatima Ahmed',
      action: 'started',
      course: 'Computer Science',
      time: '2 hours ago',
      avatar: 'FA',
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center">
          <span className="text-lg font-semibold">Recent Activity</span>
          <Button type="link" size="small" className="ml-auto" icon={<EyeOutlined />}>
            View All
          </Button>
        </div>
      }
      className="shadow-sm border-0"
      styles={{ body: { padding: '24px' } }}
    >
      <List
        dataSource={recentActivities}
        renderItem={(item) => (
          <List.Item className="border-0 px-0 py-3">
            <List.Item.Meta
              avatar={
                <Avatar size={40} style={{ backgroundColor: '#1890ff' }}>
                  {item.avatar}
                </Avatar>
              }
              title={
                <div className="flex items-center">
                  <Text strong className="text-sm">
                    {item.user}
                  </Text>
                  <Text className="text-gray-500 text-sm ml-2">{item.action}</Text>
                  <Text strong className="text-sm ml-2 text-blue-600">
                    {item.course}
                  </Text>
                </div>
              }
              description={<Text className="text-gray-400 text-xs">{item.time}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
