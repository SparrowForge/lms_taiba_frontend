import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, children }) => {
  const { t } = useLocalization();
  return (
    <Card style={{ marginTop: '8px', marginRight: '8px', marginLeft: '8px' }} size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {onBack && (
              <Button icon={<ArrowLeftOutlined />} onClick={onBack} type="text">
                {t(LOCALE_KEYS.BACK, { defaultValue: 'Back' })}
              </Button>
            )}
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
          </div>
          {children}
        </div>
      </Space>
    </Card>
  );
};
