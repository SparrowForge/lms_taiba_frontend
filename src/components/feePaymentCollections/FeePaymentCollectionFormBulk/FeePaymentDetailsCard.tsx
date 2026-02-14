'use client';

import { Card, Col, Row, Table, Typography } from 'antd';
import React, { useMemo } from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import { FEE_PLAN_STATUS_CONFIG } from './constants';
import type { FeePaymentDetailsRow } from './types';

export interface FeePaymentDetailsCardProps {
  feePaymentDetailsRows: FeePaymentDetailsRow[];
  studentFeeInstallmentPlans: { id: number; sequenceNo?: number }[];
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

export default function FeePaymentDetailsCard({
  feePaymentDetailsRows,
  studentFeeInstallmentPlans,
  t,
}: FeePaymentDetailsCardProps) {
  const columns = useMemo(
    () => [
      {
        title: 'Seq',
        dataIndex: 'feeInstallmentPlanId',
        key: 'sequence',
        width: 60,
        render: (value: number) => {
          const plan = studentFeeInstallmentPlans.find((p) => p.id === value);
          return <Typography.Text strong>{plan?.sequenceNo ?? '-'}</Typography.Text>;
        },
      },
      {
        title: t(LOCALE_KEYS.FEE_TITLE, { defaultValue: 'Fee Title' }),
        dataIndex: 'feeTitle',
        key: 'feeTitle',
        render: (value: string) => <Typography.Text>{value}</Typography.Text>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (status: string) => {
          const config = FEE_PLAN_STATUS_CONFIG[status as keyof typeof FEE_PLAN_STATUS_CONFIG];
          return (
            <Typography.Text type={config?.color as 'success' | 'warning' | 'danger'}>
              {config?.icon} {config?.text}
            </Typography.Text>
          );
        },
      },
      {
        title: t(LOCALE_KEYS.AMOUNT_DUE, { defaultValue: 'Amount Due' }),
        dataIndex: 'amountDue',
        key: 'amountDue',
        render: (value: number) => <Typography.Text>{value.toFixed(2)}</Typography.Text>,
      },
      {
        title: 'Paid',
        dataIndex: 'amountPaid',
        key: 'amountPaid',
        render: (_: number, record: FeePaymentDetailsRow) => {
          const totalPaid = record.amountPaid + (record.newAmountPaid || 0);
          return (
            <Typography.Text
              strong={totalPaid > 0}
              type={totalPaid > 0 ? 'success' : 'secondary'}
            >
              {totalPaid.toFixed(2)}
            </Typography.Text>
          );
        },
      },
      {
        title: t(LOCALE_KEYS.BALANCE_AMOUNT, { defaultValue: 'Balance' }),
        dataIndex: 'balanceAmount',
        key: 'balanceAmount',
        render: (value: number, record: FeePaymentDetailsRow) => {
          const currentBalance = record.newBalanceAmount ?? value;
          return (
            <Typography.Text type={currentBalance > 0 ? 'danger' : 'success'}>
              {currentBalance.toFixed(2)}
            </Typography.Text>
          );
        },
      },
      {
        title: 'New Payment',
        dataIndex: 'newAmountPaid',
        key: 'newAmountPaid',
        render: (_: number, record: FeePaymentDetailsRow) => {
          const newPaymentAmount = record.newAmountPaid || 0;
          if (newPaymentAmount === 0) {
            return <Typography.Text type="success">-</Typography.Text>;
          }
          return (
            <Typography.Text strong style={{ color: '#1890ff' }}>
              {newPaymentAmount.toFixed(2)}
            </Typography.Text>
          );
        },
      },
    ],
    [studentFeeInstallmentPlans, t],
  );

  return (
    <Card title={t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' })}>
      {feePaymentDetailsRows.length > 0 && (
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            border: '1px solid #d9d9d9',
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Typography.Text strong>Total Due:</Typography.Text>
              <br />
              <Typography.Text>
                {feePaymentDetailsRows.reduce((sum, row) => sum + row.amountDue, 0).toFixed(2)}
              </Typography.Text>
            </Col>
            <Col span={6}>
              <Typography.Text strong>Previously Paid:</Typography.Text>
              <br />
              <Typography.Text type="success">
                {feePaymentDetailsRows.reduce((sum, row) => sum + row.amountPaid, 0).toFixed(2)}
              </Typography.Text>
            </Col>
            <Col span={6}>
              <Typography.Text strong>New Payment:</Typography.Text>
              <br />
              <Typography.Text style={{ color: '#1890ff' }}>
                {feePaymentDetailsRows
                  .reduce((sum, row) => sum + (row.newAmountPaid || 0), 0)
                  .toFixed(2)}
              </Typography.Text>
            </Col>
            <Col span={6}>
              <Typography.Text strong>Remaining:</Typography.Text>
              <br />
              <Typography.Text type="danger">
                {feePaymentDetailsRows.reduce((sum, row) => sum + row.balanceAmount, 0).toFixed(2)}
              </Typography.Text>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '8px' }}>
            <Col span={24}>
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Total Paid (Previous + New):{' '}
                {feePaymentDetailsRows
                  .reduce((sum, row) => sum + row.amountPaid + (row.newAmountPaid || 0), 0)
                  .toFixed(2)}
              </Typography.Text>
            </Col>
          </Row>
        </div>
      )}
      <Table
        dataSource={feePaymentDetailsRows}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ x: 600 }}
      />
    </Card>
  );
}
