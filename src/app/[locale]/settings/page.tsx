'use client';

import { DesktopOutlined, LockOutlined, MoonOutlined, SafetyOutlined, SunOutlined } from '@ant-design/icons';
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

      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Appearance Settings Card */}
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
                  {t(LOCALE_KEYS.APPEARANCE)}
                </Title>
                <Text type="secondary">{t(LOCALE_KEYS.CUSTOMIZE_YOUR_APPEARANCE)}</Text>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              {/* Theme Mode Selection */}
              <div>
                <Text strong style={{ fontSize: '16px', marginBottom: '16px', display: 'block' }}>
                  {t(LOCALE_KEYS.THEME_MODE)}
                </Text>
                <Radio.Group value={themeMode} onChange={handleThemeModeChange}>
                  <Space direction="vertical" size="middle">
                    <Radio value="light">
                      <Space>
                        <SunOutlined style={{ color: '#faad14', fontSize: '16px' }} />
                        <Text>{t(LOCALE_KEYS.LIGHT_MODE)}</Text>
                      </Space>
                    </Radio>
                    <Radio value="dark">
                      <Space>
                        <MoonOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                        <Text>{t(LOCALE_KEYS.DARK_MODE)}</Text>
                      </Space>
                    </Radio>
                    <Radio value="system">
                      <Space>
                        <DesktopOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                        <Text>{t(LOCALE_KEYS.SYSTEM_MODE)}</Text>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Space>
          </Card>

          {/* Security Settings Card */}
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
                  <Space>
                    <LockOutlined style={{ fontSize: '20px' }} />
                    <span>Security</span>
                  </Space>
                </Title>
                <Text type="secondary">Manage your account security settings</Text>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                      Two-Factor Authentication
                    </Text>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                      Add an extra layer of security to your account by enabling two-factor authentication
                    </Text>
                    <Link href="twofa-settings">
                      <Button 
                        type="primary" 
                        icon={<SafetyOutlined />}
                        size="large"
                        style={{ 
                          height: '40px',
                          borderRadius: '6px',
                          fontWeight: 500
                        }}
                      >
                        Setup Two Factor Authentication
                      </Button>
                    </Link>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </Space>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;
