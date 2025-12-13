import { UserOutlined } from '@ant-design/icons';
import { Alert, Avatar, Card, Col, Row, Spin, Typography } from 'antd';
import React, { useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useAudit } from '@/hooks/useAudit';
import { useLocalization } from '@/hooks/useLocalization';

import PageHeaderDetails from './PageHeaderDetails';
import StudentProfileQr from '../students/StudentProfileQr';
import { useAuth } from '@/hooks/useAuth';
import StudentProfile from '../students/StudentProfile';
import UpperTab from '../lms/UpperTab';
import { StudentProfileTabData, StudentTabData } from '../coursesStudent/TabData';
import CourseMaterials from '../lms/CourseMaterials';
import Assignments from '../coursesStudent/Assignments';
import SubmittedAssignment from '../coursesStudent/SubmittedAssignment';
import StudentExamParticipate from '../exams/StudentExamParticipate';
import { usePathname, useSearchParams } from 'next/navigation';

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
  config,
}: {
  config: EntityDetailsConfig<T>;
}) => {
  const { t } = useLocalization();
  const { auditsByResource } = useAudit();
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth()
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const pathname = usePathname();

  const isStudentPage = pathname.includes('students');

  if (config.loading) {
    return (
      <div style={{ padding: config.embedded ? '0' : '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          {t(LOCALE_KEYS.LOADING)} {config.name}{' '}
          {t(LOCALE_KEYS.DETAILS_NAME, { name: config.name })}...
        </div>
      </div>
    );
  }
  if (config.error) {
    return (
      <div style={{ padding: config.embedded ? '0' : '24px' }}>
        <Alert message={t(LOCALE_KEYS.ERROR)} description={config.error} type="error" showIcon />
      </div>
    );
  }
  if (!config.item) {
    return (
      <div style={{ padding: config.embedded ? '0' : '24px' }}>
        <Alert
          message={t(LOCALE_KEYS.NOT_FOUND_NAME, { name: config.name })}
          description={t(LOCALE_KEYS.NOT_FOUND_DESCRIPTION, { name: config.name })}
          type="warning"
          showIcon
        />
      </div>
    );
  }
  const content = (
    <div style={{ marginTop: config.embedded ? '0' : '8px' }}>
      <Row gutter={[8, 8]}>
        {/* Profile Card */}
        <Col xs={8} lg={config.embedded ? 24 : 8}>
          <Card title={`${config.name} ${t(LOCALE_KEYS.PROFILE)}`}>
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
              <Text type="secondary">ID: {config.item.id}</Text>
            </div>
          </Card>
          {
            isStudentPage && <StudentProfileQr />
          }

        </Col>
        {/* Details Table */}
        <Col xs={8} lg={config.embedded ? 24 : 16}>
          {
            isStudentPage ? <>
              <UpperTab items={StudentProfileTabData} initial={tab ?? 'materials'} onTabChange={(tab) => setActiveTab(tab)} />
              {activeTab === 'profile' && <StudentProfile config={config} />}
              {activeTab === 'materials' && <CourseMaterials />}
              {activeTab === 'assignments' && <Assignments />}
              {activeTab === 'submittedAssignments' && <SubmittedAssignment />}
              {activeTab === 'exam' && <StudentExamParticipate />}
              {activeTab === 'grading' && <div>Grading Content is empty</div>}
              {activeTab === 'discussion' && <div>Discussion Content</div>}
            </> : <Card title={`${config.name} ${t(LOCALE_KEYS.INFORMATION)}`}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {config.fields.map((field, index) => (
                      <tr
                        key={field.key}
                        style={{
                          borderBottom:
                            index < config.fields.length - 1 ? '1px solid #f0f0f0' : 'none',
                        }}
                      >
                        <td
                          style={{
                            padding: '12px 16px',
                            fontWeight: '600',
                            // backgroundColor: '#fafafa',
                            width: '30%',
                            verticalAlign: 'top',
                          }}
                        >
                          {field.label}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            verticalAlign: 'top',
                          }}
                        >
                          {field.render
                            ? field.render((config.item as any)[field.key], config.item!)
                            : (config.item as any)[field.key]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          }
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
    <div style={{ padding: '8px' }}>
      {/* Header */}
      <PageHeaderDetails
        title={t(LOCALE_KEYS.DETAILS_NAME, { name: config.name })}
        onBack={config.onBack}
        onEdit={config.onEdit ? () => config.onEdit!(config.item!) : undefined}
        editText={t(LOCALE_KEYS.EDIT_NAME, { name: config.name })}
      />
      {content}
    </div>
  );
};
