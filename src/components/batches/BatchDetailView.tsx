'use client';

import { Alert, Card, Col, Descriptions, Row, Spin, Tabs, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import type { IBatch } from '@/types/batch';
import type { ISemester } from '@/types/semester';
import type { ISection } from '@/types/section';

const { Text } = Typography;

export interface BatchDetailViewProps {
  batch: IBatch | null;
  loading: boolean;
  error: string | null;
  entityName: string;
  onBack?: () => void;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

function OverviewTab({ batch, t }: { batch: IBatch; t: BatchDetailViewProps['t'] }) {
  const formatDate = (d: string | undefined) =>
    d ? dayjs(d).format('YYYY-MM-DD') : '—';

  return (
    <Card size="small" title={t(LOCALE_KEYS.INFORMATION)}>
      <Descriptions column={{ xs: 1, sm: 1, md: 2 }} size="small" bordered>
        <Descriptions.Item label={t(LOCALE_KEYS.NAME)}>{batch.name}</Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.CODE)}>{batch.code}</Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.COURSE)}>
          {batch.course?.name ?? '—'}
        </Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.ACADEMIC_YEAR)}>
          {batch.academicYear ?? '—'}
        </Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.SESSION)}>{batch.session ?? '—'}</Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.INTAKE_CAPACITY)}>
          {batch.intakeCapacity ?? '—'}
        </Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.START_DATE)}>
          {formatDate(batch.startDate)}
        </Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.END_DATE)}>
          {formatDate(batch.endDate)}
        </Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.STATUS)}>{batch.status ?? '—'}</Descriptions.Item>
        <Descriptions.Item label={t(LOCALE_KEYS.REMARKS)} span={2}>
          {batch.remarks || '—'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

function SemestersTab({ semesters, t }: { semesters: ISemester[]; t: BatchDetailViewProps['t'] }) {
  if (!semesters?.length) {
    return (
      <Card size="small">
        <Text type="secondary">No {t(LOCALE_KEYS.SEMESTERS).toLowerCase()}.</Text>
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {semesters.map((sem) => (
        <Col xs={24} sm={24} md={12} lg={8} key={sem.id}>
          <Card size="small" title={`${t(LOCALE_KEYS.SEMESTER)} ${sem.termNo}: ${sem.name}`}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t(LOCALE_KEYS.NAME)}>{sem.name}</Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.TERM_NO)}>{sem.termNo}</Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.START_DATE)}>
                {sem.startDate ? dayjs(sem.startDate).format('YYYY-MM-DD') : '—'}
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.END_DATE)}>
                {sem.endDate ? dayjs(sem.endDate).format('YYYY-MM-DD') : '—'}
              </Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.STATUS)}>{sem.status}</Descriptions.Item>
              {sem.creditHours != null && (
                <Descriptions.Item label={t(LOCALE_KEYS.CREDIT_HOURS)}>
                  {sem.creditHours}
                </Descriptions.Item>
              )}
              <Descriptions.Item label={t(LOCALE_KEYS.REMARKS)}>
                {sem.remarks || '—'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function SectionsTab({ sections, t }: { sections: ISection[]; t: BatchDetailViewProps['t'] }) {
  if (!sections?.length) {
    return (
      <Card size="small">
        <Text type="secondary">No {t(LOCALE_KEYS.SECTIONS).toLowerCase()}.</Text>
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {sections.map((sec) => (
        <Col xs={24} sm={24} md={12} lg={8} key={sec.id}>
          <Card size="small" title={sec.name}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t(LOCALE_KEYS.NAME)}>{sec.name}</Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.CODE)}>{sec.code}</Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.STATUS)}>{sec.status}</Descriptions.Item>
              <Descriptions.Item label={t(LOCALE_KEYS.REMARKS)}>
                {sec.remarks || '—'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <Card size="small">
      <Text type="secondary">{label} — Coming soon.</Text>
    </Card>
  );
}

export default function BatchDetailView({
  batch,
  loading,
  error,
  entityName,
  t,
}: BatchDetailViewProps) {
  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          {t(LOCALE_KEYS.LOADING)} {entityName} {t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert message={t(LOCALE_KEYS.ERROR)} description={error} type="error" showIcon />
      </div>
    );
  }

  if (!batch) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message={t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}
          type="info"
          showIcon
        />
      </div>
    );
  }

  const semesters = batch.semesters ?? [];
  const sections = batch.sections ?? [];

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: <OverviewTab batch={batch} t={t} />,
    },
    {
      key: 'semesters',
      label: t(LOCALE_KEYS.SEMESTERS),
      children: <SemestersTab semesters={semesters} t={t} />,
    },
    {
      key: 'sections',
      label: t(LOCALE_KEYS.SECTIONS),
      children: <SectionsTab sections={sections} t={t} />,
    },
    {
      key: 'events',
      label: t(LOCALE_KEYS.EVENTS),
      children: <EmptyTab label={t(LOCALE_KEYS.EVENTS)} />,
    },
    {
      key: 'students',
      label: t(LOCALE_KEYS.STUDENTS),
      children: <EmptyTab label={t(LOCALE_KEYS.STUDENTS)} />,
    },
    {
      key: 'calendar',
      label: t(LOCALE_KEYS.CALENDAR_VIEW),
      children: <EmptyTab label={t(LOCALE_KEYS.CALENDAR_VIEW)} />,
    },
    {
      key: 'curriculum',
      label: 'Curriculum',
      children: <EmptyTab label="Curriculum" />,
    },
  ];

  return (
    <>
      <style>{`
        .batch-detail-tabs-fixed { display: flex; flex-direction: column; height: calc(100vh - 200px); min-height: 300px; overflow: hidden; }
        .batch-detail-tabs-fixed .ant-tabs { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; }
        .batch-detail-tabs-fixed .ant-tabs-nav { position: sticky; top: 0; z-index: 10; background: var(--ant-color-bg-container); margin-bottom: 0; flex-shrink: 0; }
        .batch-detail-tabs-fixed .ant-tabs-content-holder { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; }
        .batch-detail-tabs-fixed .ant-tabs-content { flex: 1; min-height: 0; overflow: hidden; }
        .batch-detail-tabs-fixed .ant-tabs-tabpane { height: 100%; overflow-y: auto; }
      `}</style>
      <div className="batch-detail-tabs-fixed">
        <Tabs
          defaultActiveKey="overview"
          items={tabItems}
          tabBarStyle={{ flexShrink: 0 }}
        />
      </div>
    </>
  );
}
