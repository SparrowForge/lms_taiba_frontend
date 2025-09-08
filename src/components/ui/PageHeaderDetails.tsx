import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

const { Title } = Typography;

interface PageHeaderDetailsProps {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  editText?: string;
  backText?: string;
}

const PageHeaderDetails: React.FC<PageHeaderDetailsProps> = ({
  title,
  onBack,
  onEdit,
  editText,
  backText,
}) => {
  const { t } = useLocalization();

  return (
    <Card size="small">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onBack && (
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} type="text">
              {backText || t(LOCALE_KEYS.BACK)}
            </Button>
          )}
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
        </div>
        {onEdit && (
          <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
            {editText || t(LOCALE_KEYS.EDIT)}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PageHeaderDetails;
