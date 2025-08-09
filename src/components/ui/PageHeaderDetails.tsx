import {ArrowLeftOutlined, EditOutlined} from '@ant-design/icons';
import {Button, Card, Typography} from 'antd';
import {useTranslations} from 'next-intl';
import React from 'react';

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
  const t = useTranslations();

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
              {backText || t('back')}
            </Button>
          )}
          <Title level={4} style={{ margin: 0}}>
              {title}
          </Title>
        </div>
        {onEdit && (
          <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
            {editText || t('edit')}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PageHeaderDetails;
