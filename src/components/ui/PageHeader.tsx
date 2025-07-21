import React from 'react';
import {Button, Card, Space, Typography} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  children
}) => {
  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {onBack && (
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                type="text"
              >
                Back
              </Button>
            )}
            <Title level={2} style={{ margin: 0 }}>{title}</Title>
          </div>
          {children}
        </div>
      </Space>
    </Card>
  );
};
