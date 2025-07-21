import React from 'react';
import {Alert, Avatar, Button, Card, Col, Row, Space, Spin, Typography} from 'antd';
import {ArrowLeftOutlined, EditOutlined, UserOutlined} from '@ant-design/icons';

const { Title, Text } = Typography;

// Generic interface for entity details configuration
export interface EntityDetailsConfig<T> {
  name: string;
  route: string;
  getDisplayName: (item: T) => string;
  getInitials: (item: T) => string;
  item: T | null;
  loading: boolean;
  error: string | null;
  fields: {
    key: string;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
  }[];
  onEdit?: (item: T) => void;
  onBack?: () => void;
  embedded?: boolean; // If true, don't show header actions
}

// Generic EntityDetailsContent component
export const EntityDetailsContent = <T extends { id: number }>({
  config
}: {
  config: EntityDetailsConfig<T>
}) => {
  if (config.loading) {
    return (
      <div style={{ padding: config.embedded ? '0' : '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading {config.name} details...</div>
      </div>
    );
  }

  if (config.error) {
    return (
      <div style={{ padding: config.embedded ? '0' : '24px' }}>
        <Alert
          message="Error"
          description={config.error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!config.item) {
    return (
      <div style={{ padding: config.embedded ? '0' : '24px' }}>
        <Alert
          message={`${config.name} Not Found`}
          description={`The ${config.name} you're looking for doesn't exist.`}
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const content = (
    <div style={{ marginTop: config.embedded ? '0' : '24px' }}>
      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} lg={config.embedded ? 24 : 8}>
          <Card title={`${config.name} Profile`}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={config.embedded ? 60 : 80}
                icon={<UserOutlined />}
                style={{ marginBottom: '16px', fontSize: config.embedded ? '24px' : '32px' }}
              >
                {config.getInitials(config.item)}
              </Avatar>
              <Title level={config.embedded ? 5 : 4} style={{ marginBottom: '8px' }}>
                {config.getDisplayName(config.item)}
              </Title>
              <Text type="secondary">
                ID: {config.item.id}
              </Text>
            </div>
          </Card>
        </Col>

        {/* Details Table */}
        <Col xs={24} lg={config.embedded ? 24 : 16}>
          <Card title={`${config.name} Information`}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {config.fields.map((field, index) => (
                    <tr key={field.key} style={{ borderBottom: index < config.fields.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <td style={{
                        padding: '12px 16px',
                        fontWeight: '600',
                        backgroundColor: '#fafafa',
                        width: '30%',
                        verticalAlign: 'top'
                      }}>
                        {field.label}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        verticalAlign: 'top'
                      }}>
                        {field.render ? field.render((config.item as any)[field.key], config.item!) : (config.item as any)[field.key]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // If embedded, return just the content
  if (config.embedded) {
    return content;
  }

  // If not embedded, return with header actions
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {config.onBack && (
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={config.onBack}
                  type="text"
                >
                  Back
                </Button>
              )}
              <Title level={2} style={{ margin: 0 }}>{config.name} Details</Title>
            </div>
            {config.onEdit && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => config.onEdit!(config.item!)}
              >
                Edit {config.name}
              </Button>
            )}
          </div>
        </Space>
      </Card>

      {content}
    </div>
  );
};
