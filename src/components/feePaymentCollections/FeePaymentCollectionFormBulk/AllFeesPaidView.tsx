'use client';

import { Card, Col, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import type { IStudentWithFeeInfo } from '@/types/student';

export interface AllFeesPaidViewProps {
  studentId: string | null;
  studentWithFeeInfo: IStudentWithFeeInfo;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

export default function AllFeesPaidView({
  studentId,
  studentWithFeeInfo,
  t,
}: AllFeesPaidViewProps) {
  const paymentCollectionsColumns = [
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      key: 'paymentMode',
    },
    {
      title: 'Transaction Ref',
      dataIndex: 'transactionRef',
      key: 'transactionRef',
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: (value: number) =>
        `${value.toFixed(2)} ${studentWithFeeInfo.feeStructure?.currency || ''}`,
    },
    {
      title: 'Payment Details',
      dataIndex: 'paymentDetails',
      key: 'paymentDetails',
      render: (paymentDetails: { feeTitle: string; amountPaid: number }[]) => {
        if (!paymentDetails || paymentDetails.length === 0) {
          return <Typography.Text type="secondary">No details</Typography.Text>;
        }
        return (
          <div>
            {paymentDetails.map((detail, index) => (
              <div key={index} style={{ marginBottom: '4px', fontSize: '12px' }}>
                <Typography.Text strong>{detail.feeTitle}:</Typography.Text>
                <br />
                <Typography.Text type="success">
                  {detail.amountPaid.toFixed(2)}{' '}
                  {studentWithFeeInfo.feeStructure?.currency || ''}
                </Typography.Text>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Typography.Text type={status === 'paid' ? 'success' : 'warning'}>
          {status.toUpperCase()}
        </Typography.Text>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Card style={{ margin: '0 auto', padding: '24px' }} role="main" aria-labelledby="form-title">
        {studentId && studentWithFeeInfo?.student && (
          <Card
            title={t(LOCALE_KEYS.STUDENT_INFORMATION, { defaultValue: 'Student Information' })}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.NAME, { defaultValue: 'Name' })}:
                </Typography.Text>
                <br />
                <Typography.Text>
                  {studentWithFeeInfo.student.firstName} {studentWithFeeInfo.student.lastName}
                </Typography.Text>
              </Col>
              <Col span={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.APPLICATION_NO, { defaultValue: 'Application No' })}:
                </Typography.Text>
                <br />
                <Typography.Text>{studentWithFeeInfo.student.applicationNo}</Typography.Text>
              </Col>
              <Col span={8}>
                <Typography.Text strong>
                  {t(LOCALE_KEYS.REGISTRATION_NO, { defaultValue: 'Registration No' })}:
                </Typography.Text>
                <br />
                <Typography.Text>{studentWithFeeInfo.student.registrationNo}</Typography.Text>
              </Col>
            </Row>
          </Card>
        )}

        <Card title="All Fees Paid - Payment History">
          <Typography.Text
            type="success"
            style={{ fontSize: '16px', marginBottom: '16px', display: 'block' }}
          >
            ✅ All installment plans have been fully paid!
          </Typography.Text>
          <Table
            dataSource={studentWithFeeInfo.paymentCollections}
            columns={paymentCollectionsColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      </Card>
    </div>
  );
}
