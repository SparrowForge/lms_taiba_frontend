'use client';

import { DesktopOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Radio, Space, Typography } from 'antd';
import Link from "next/link"

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import { useSettings } from '@/hooks/useSettings';

const { Title, Text } = Typography;

function SettingsPage() {
  const { t } = useLocalization();
  const { themeMode, updateThemeMode } = useSettings();

  const handleThemeModeChange = (e: any) => {
    updateThemeMode(e.target.value);
  };

  return (
    <MainLayout>
      <PageHeader title={t(LOCALE_KEYS.SETTINGS)} />

      <div style={{ padding: '24px' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {t(LOCALE_KEYS.APPEARANCE)}
              </Title>
              <Text type="secondary">{t(LOCALE_KEYS.CUSTOMIZE_YOUR_APPEARANCE)}</Text>
            </div>

            <Divider />

            {/* Theme Mode Selection */}
            <div>
              <Text strong style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>
                {t(LOCALE_KEYS.THEME_MODE)}
              </Text>
              <Radio.Group value={themeMode} onChange={handleThemeModeChange}>
                <Space direction="vertical">
                  <Radio value="light">
                    <Space>
                      <SunOutlined style={{ color: '#faad14' }} />
                      <Text>{t(LOCALE_KEYS.LIGHT_MODE)}</Text>
                    </Space>
                  </Radio>
                  <Radio value="dark">
                    <Space>
                      <MoonOutlined style={{ color: '#1890ff' }} />
                      <Text>{t(LOCALE_KEYS.DARK_MODE)}</Text>
                    </Space>
                  </Radio>
                  <Radio value="system">
                    <Space>
                      <DesktopOutlined style={{ color: '#52c41a' }} />
                      <Text>{t(LOCALE_KEYS.SYSTEM_MODE)}</Text>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </Space>
        </Card>
      </div>
        <div className="m-8">
            <Button type='primary'>
              <Link href="twofa-settings">
                Setup Two Factor Authentication 
              </Link>
            </Button>
        </div>
    </MainLayout>
  );
}

export default SettingsPage;
