import React from 'react';
import {Button, Card} from 'antd';
import {ArrowLeftOutlined, EditOutlined} from '@ant-design/icons';
import {useTranslations} from 'next-intl';

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
  backText
}) => {
  const t = useTranslations();

  return (
    <Card>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onBack && (
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            type="text"
          >
            {backText || t('back')}
          </Button>
        )}
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{title}</h1>
      </div>
      {onEdit && (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          {editText || t('edit')}
        </Button>
        )}
      </div>
    </Card>
  );
};

export default PageHeaderDetails;
