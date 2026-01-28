'use client';

import { HomeOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';

const { Title, Text, Paragraph } = Typography;

export const AccessDenied = () => {
  const { t } = useLocalization();
  const params = useParams();
  const locale = params?.locale || 'en';

  return (
    <MainLayout>
      <PageHeader title="Access Denied" />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: '24px',
        }}
      >
        <Card
          style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              marginBottom: '24px',
              color: '#ff4d4f',
            }}
          >
            <LockOutlined />
          </div>

          <Title level={2} style={{ marginBottom: '16px' }}>
            Access Denied
          </Title>

          <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            You don&apos;t have permission to access this page.
          </Paragraph>

          <Link href={`/${locale}`}>
            <Button type="primary" size="large" icon={<HomeOutlined />}>
              {t(LOCALE_KEYS.GO_TO_HOME)}
            </Button>
          </Link>
        </Card>
      </div>
    </MainLayout>
  );
};
