'use client';

import {
  BookOutlined,
  FileTextOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card } from 'antd';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const QuickActionsSection = () => {
  const quickActions: QuickAction[] = [
    {
      title: 'Add New Student',
      description: 'Register a new student',
      icon: <UserOutlined />,
      color: '#3f8600',
    },
    {
      title: 'Create Course',
      description: 'Set up a new course',
      icon: <BookOutlined />,
      color: '#1890ff',
    },
    {
      title: 'View Reports',
      description: 'Check system analytics',
      icon: <FileTextOutlined />,
      color: '#722ed1',
    },
    {
      title: 'Manage Teachers',
      description: 'Add or edit teachers',
      icon: <TeamOutlined />,
      color: '#fa8c16',
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center">
          <span className="text-lg font-semibold">Quick Actions</span>
          <Button type="link" size="small" className="ml-auto" icon={<PlusOutlined />}>
            More
          </Button>
        </div>
      }
      className="shadow-sm border-0"
      styles={{ body: { padding: '24px' } }}
    >
      <div className="space-y-4">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <div style={{ color: action.color, fontSize: '18px' }}>{action.icon}</div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
