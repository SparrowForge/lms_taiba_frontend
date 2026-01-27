'use client';

import { EditOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { UserType } from '@/enums/user-type.enum';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import UserStatusTag from '@/components/users/UserStatusTag';

import { useAuth } from '@/hooks/useAuth';
import { useLocalization } from '@/hooks/useLocalization';

const { Title, Text } = Typography;

const ProfileSettings = () => {
  const router = useRouter();
  const { user, getUserFullName } = useAuth();
  const { t } = useLocalization();

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  const getUserTypeLabel = (type?: UserType) => {
    if (!type) return 'N/A';
    switch (type) {
      case UserType.ADMIN:
        return 'Admin';
      case UserType.FACULTY:
        return 'Faculty';
      case UserType.STUDENT:
        return 'Student';
      default:
        return type;
    }
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.PROFILE)} />
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Text type="secondary">Loading user information...</Text>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader title={t(LOCALE_KEYS.PROFILE)} onBack={() => router.back()} />

        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Profile Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                <Avatar size={80} style={{ backgroundColor: '#1890ff', fontSize: '32px' }}>
                  {getUserInitials()}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
                    {getUserFullName() || user.name || user.email}
                  </Title>
                  <Space>
                    <Tag color="blue">{getUserTypeLabel(user.type)}</Tag>
                    <UserStatusTag status={user.status} />
                  </Space>
                </div>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="large"
                  onClick={() => router.push(`/users/${user.id}/edit`)}
                >
                  {t(LOCALE_KEYS.EDIT, { defaultValue: 'Edit' })}
                </Button>
              </div>

              {/* User Information */}
              <Descriptions title={t(LOCALE_KEYS.INFORMATION, { defaultValue: 'Information' })} bordered column={1}>
                <Descriptions.Item
                  label={
                    <Space>
                      <UserOutlined />
                      <span>{t(LOCALE_KEYS.NAME, { defaultValue: 'Name' })}</span>
                    </Space>
                  }
                >
                  {user.name || 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <Space>
                      <MailOutlined />
                      <span>{t(LOCALE_KEYS.EMAIL, { defaultValue: 'Email' })}</span>
                    </Space>
                  }
                >
                  {user.email || 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <Space>
                      <PhoneOutlined />
                      <span>{t(LOCALE_KEYS.PHONE, { defaultValue: 'Phone' })}</span>
                    </Space>
                  }
                >
                  {user.phone || 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label={t(LOCALE_KEYS.TYPE, { defaultValue: 'Type' })}>
                  <Tag color="blue">{getUserTypeLabel(user.type)}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label={t(LOCALE_KEYS.STATUS, { defaultValue: 'Status' })}>
                  <UserStatusTag status={user.status} />
                </Descriptions.Item>

                {user.userRoles && user.userRoles.length > 0 && (
                  <Descriptions.Item label={t(LOCALE_KEYS.ROLES, { defaultValue: 'Roles' })}>
                    <Space wrap>
                      {user.userRoles.map((userRole, index) => (
                        <Tag key={index} color="purple">
                          {userRole.name || 'N/A'}
                        </Tag>
                      ))}
                    </Space>
                  </Descriptions.Item>
                )}

                {user.faculty && (
                  <Descriptions.Item label={t(LOCALE_KEYS.FACULTY, { defaultValue: 'Faculty' })}>
                    {user.faculty.fullName || 'N/A'}
                  </Descriptions.Item>
                )}

                {user.student && (
                  <Descriptions.Item label={t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' })}>
                    {user.student.firstName} {user.student.middleName} {user.student.lastName}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label={t(LOCALE_KEYS.TWO_FACTOR_AUTHENTICATION, { defaultValue: '2FA Status' })}>
                  <Tag color={user.twoFaStatus === 'active' ? 'green' : 'default'}>
                    {user.twoFaStatus === 'active' ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label={t(LOCALE_KEYS.CREATED_AT, { defaultValue: 'Created At' })}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label={t(LOCALE_KEYS.UPDATED_AT, { defaultValue: 'Updated At' })}>
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfileSettings;
