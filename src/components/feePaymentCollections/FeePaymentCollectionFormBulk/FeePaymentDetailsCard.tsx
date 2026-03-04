'use client';

import { Card, Col, Row, Table, Typography } from 'antd';
import React, { useMemo } from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import type { IDiscountTemplate } from '@/types/discountTemplate';
import type { IFeeStructure } from '@/types/feeStructure';
import type { IFeePaymentSummary } from '@/types/student';

import { FEE_PLAN_STATUS_CONFIG } from './constants';
import type { FeePaymentDetailsRow } from './types';

export interface FeePaymentDetailsCardProps {
  feePaymentDetailsRows: FeePaymentDetailsRow[];
  studentFeeInstallmentPlans: { id: number; sequenceNo?: number }[];
  /** When provided, discount and grand total summary (invoice-style) is shown */
  feeStructure?: IFeeStructure | null;
  /** Discount templates from student response (student.discountTemplates). Used to show discount breakdown in summary. */
  discountTemplates?: IDiscountTemplate[] | null;
  isInternational?: boolean;
  /** When provided (e.g. from API), fee summary from server is shown */
  feeSummary?: IFeePaymentSummary | null;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

export default function FeePaymentDetailsCard({
  feePaymentDetailsRows,
  studentFeeInstallmentPlans,
  feeStructure,
  discountTemplates = [],
  isInternational = false,
  feeSummary: feeSummaryFromApi = null,
  t,
}: FeePaymentDetailsCardProps) {
  const currency = feeStructure?.currency ?? '';

  /** Per-discount breakdown from student.discountTemplates (for display only). Totals come from feeSummary API. */
  const discountRowsForDisplay = useMemo(() => {
    if (!feeStructure || !discountTemplates?.length) return [];
    const baseAfterAdmission = Math.max(
      0,
      Number(feeStructure.totalFees || 0) - Number(feeStructure.admissionFee || 0),
    );
    return discountTemplates.map((dt) => {
      const amount =
        dt.type === 'percent'
          ? (baseAfterAdmission * Number(dt.amount || 0)) / 100
          : Number(dt.amount || 0);
      return { template: dt, amount };
    });
  }, [feeStructure, discountTemplates]);

  const totalPaidFromRows = useMemo(
    () =>
      feePaymentDetailsRows.reduce(
        (sum, row) => sum + row.amountPaid + (row.newAmountPaid || 0),
        0,
      ),
    [feePaymentDetailsRows],
  );

  const previousPaidFromRows = useMemo(
    () =>
      feePaymentDetailsRows.reduce((sum, row) => sum + row.amountPaid, 0),
    [feePaymentDetailsRows],
  );

  const newPaymentFromRows = useMemo(
    () =>
      feePaymentDetailsRows.reduce((sum, row) => sum + (row.newAmountPaid || 0), 0),
    [feePaymentDetailsRows],
  );

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
      {feeSummaryFromApi && (
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            border: '1px solid #d9d9d9',
            backgroundColor: '#f0f7ff',
          }}
        >
          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
            {t(LOCALE_KEYS.SUMMARY, { defaultValue: 'Summary' })}
          </Typography.Text>
          <Row gutter={[8, 4]}>
            <Col span={24}>
              <Typography.Text type="secondary">Total Due:</Typography.Text>
              <Typography.Text style={{ float: 'right' }}>
                {feeSummaryFromApi.totalDue.toFixed(2)} {currency}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text type="secondary">Total Discount:</Typography.Text>
              <Typography.Text style={{ float: 'right' }}>
                -{feeSummaryFromApi.totalDiscount.toFixed(2)} {currency}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text type="secondary">Net Due:</Typography.Text>
              <Typography.Text style={{ float: 'right' }}>
                {feeSummaryFromApi.netDue.toFixed(2)} {currency}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text type="secondary">VAT:</Typography.Text>
              <Typography.Text style={{ float: 'right' }}>
                {feeSummaryFromApi.vatAmount.toFixed(2)} {currency}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text strong>Total Amount Due:</Typography.Text>
              <Typography.Text strong style={{ float: 'right' }}>
                {feeSummaryFromApi.totalAmountDue.toFixed(2)} {currency}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text type="secondary">Total Paid:</Typography.Text>
              <Typography.Text type="success" style={{ float: 'right' }}>
                {feeSummaryFromApi.totalPaid.toFixed(2)} {currency}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text strong>Outstanding Balance:</Typography.Text>
              <Typography.Text strong type="danger" style={{ float: 'right' }}>
                {feeSummaryFromApi.outstandingBalance.toFixed(2)} {currency}
              </Typography.Text>
            </Col>
          </Row>
          {discountRowsForDisplay.length > 0 && (
            <Row gutter={[8, 4]} style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e8e8e8' }}>
              <Col span={24}>
                <Typography.Text strong type="secondary" style={{ fontSize: 12 }}>
                  Discount breakdown (from student):
                </Typography.Text>
              </Col>
              {discountRowsForDisplay.map(({ template, amount }) => {
                const valueLabel =
                  template.type === 'percent'
                    ? `${template.amount}%`
                    : `${Number(template.amount || 0).toFixed(2)} ${currency}`;
                return (
                  <Col span={24} key={template.id}>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {template.name} · Value: {valueLabel}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ float: 'right', fontSize: 12 }}>
                      -{amount.toFixed(2)} {currency}
                    </Typography.Text>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      )}
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
              <Typography.Text strong>
                {feeSummaryFromApi ? 'Total Amount Due:' : 'Total Due:'}
              </Typography.Text>
              <br />
              <Typography.Text>
                {feeSummaryFromApi
                  ? feeSummaryFromApi.totalAmountDue.toFixed(2)
                  : feePaymentDetailsRows
                      .reduce((sum, row) => sum + row.amountDue, 0)
                      .toFixed(2)}
              </Typography.Text>
            </Col>
            <Col span={6}>
              <Typography.Text strong>Previously Paid:</Typography.Text>
              <br />
              <Typography.Text type="success">
                {feeSummaryFromApi
                  ? feeSummaryFromApi.totalPaid.toFixed(2)
                  : previousPaidFromRows.toFixed(2)}
              </Typography.Text>
            </Col>
            <Col span={6}>
              <Typography.Text strong>New Payment:</Typography.Text>
              <br />
              <Typography.Text style={{ color: '#1890ff' }}>
                {newPaymentFromRows.toFixed(2)}
              </Typography.Text>
            </Col>
            <Col span={6}>
              <Typography.Text strong>Remaining:</Typography.Text>
              <br />
              <Typography.Text type="danger">
                {feeSummaryFromApi
                  ? Math.max(0, feeSummaryFromApi.outstandingBalance - newPaymentFromRows).toFixed(
                      2,
                    )
                  : feePaymentDetailsRows
                      .reduce((sum, row) => sum + row.balanceAmount, 0)
                      .toFixed(2)}
              </Typography.Text>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '8px' }}>
            <Col span={24}>
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Total Paid (Previous + New):{' '}
                {(feeSummaryFromApi
                  ? feeSummaryFromApi.totalPaid + newPaymentFromRows
                  : totalPaidFromRows
                ).toFixed(2)}{' '}
                {currency}
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
