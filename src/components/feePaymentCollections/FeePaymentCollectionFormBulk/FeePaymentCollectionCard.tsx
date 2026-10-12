'use client';

import { Card, Col, DatePicker, Form, Input, Row, Select, Typography } from 'antd';
import type { FormInstance } from 'antd';
import React, { useRef, useEffect } from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import { PAYMENT_MODE_OPTIONS, PAYMENT_STATUS_OPTIONS } from '@/enums/payment.enum';

import type { IStudentWithFeeInfo } from '@/types/student';
import type { IFeeStructure } from '@/types/feeStructure';

import { StatusSelectFormItem } from '@/components/ui/StatusSelect';

import type { FeePaymentDetailsRow } from './types';

const { TextArea } = Input;

export interface FeePaymentCollectionCardProps {
  form: FormInstance;
  studentId: string | null;
  studentFeeStructure: IFeeStructure | null | undefined;
  studentWithFeeInfo: IStudentWithFeeInfo | null;
  originalRows: FeePaymentDetailsRow[];
  onDistributeAmount: (totalAmountPaid: number) => void;
  onResetRows: () => void;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

export default function FeePaymentCollectionCard({
  form,
  studentId,
  studentFeeStructure,
  studentWithFeeInfo,
  originalRows,
  onDistributeAmount,
  onResetRows,
  t,
}: FeePaymentCollectionCardProps) {
  const maxAllowed = originalRows.reduce((sum, row) => sum + row.balanceAmount, 0);
  const distributeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (distributeTimeoutRef.current) clearTimeout(distributeTimeoutRef.current);
    };
  }, []);

  const scheduleDistribute = (value: number) => {
    if (distributeTimeoutRef.current) clearTimeout(distributeTimeoutRef.current);
    if (value && value > 0) {
      distributeTimeoutRef.current = setTimeout(() => onDistributeAmount(value), 400);
    } else {
      distributeTimeoutRef.current = setTimeout(() => onResetRows(), 400);
    }
  };

  return (
    <Card
      title={t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
        defaultValue: 'Fee Payment Collection',
      })}
    >
      <Form.Item name="studentId" hidden>
        <Input value={parseInt(studentId || '0')} />
      </Form.Item>

      {studentFeeStructure && (
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
              <Typography.Text strong>
                {t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' })}:
              </Typography.Text>
              <br />
              <Typography.Text>{studentFeeStructure.templateName}</Typography.Text>
              <br />
              <Typography.Text type="secondary">
                {t(LOCALE_KEYS.TOTAL_FEES, { defaultValue: 'Total Fees' })}:{' '}
                {studentFeeStructure.currency} {studentFeeStructure.totalFees}
              </Typography.Text>
            </div>
          </Col>
        </Row>
      )}

      <Form.Item name="feeStructureId" hidden>
        <Input value={studentFeeStructure?.id || 0} />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="paymentDate"
            label={t(LOCALE_KEYS.PAYMENT_DATE, { defaultValue: 'Payment Date' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.PAYMENT_DATE),
                }),
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.PAYMENT_DATE) })}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="paymentMode"
            label={t(LOCALE_KEYS.PAYMENT_MODE, { defaultValue: 'Payment Mode' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.PAYMENT_MODE),
                }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.PAYMENT_MODE) })}
            >
              {PAYMENT_MODE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {t(option.labelKey as LocaleKey)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="transactionRef"
            label={t(LOCALE_KEYS.TRANSACTION_REF, { defaultValue: 'Transaction Reference' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.TRANSACTION_REF),
                }),
              },
            ]}
          >
            <Input
              placeholder={t(LOCALE_KEYS.ENTER_NAME, {
                name: t(LOCALE_KEYS.TRANSACTION_REF),
              })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="amountPaid"
            label={t(LOCALE_KEYS.AMOUNT_PAID)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.AMOUNT_PAID),
                }),
              },
            ]}
          >
            <Input
              style={{ width: '100%' }}
              placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
              type="number"
              min={1}
              step={1}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                form.setFieldsValue({ amountPaid: value });
                form.setFields([{ name: 'amountPaid', errors: [] }]);
                scheduleDistribute(value);
              }}
            />
            <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
              Maximum allowed: {maxAllowed.toFixed(2)}
            </div>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="currency"
            label={t(LOCALE_KEYS.CURRENCY)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CURRENCY) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_CURRENCY)}
              disabled
              value={studentWithFeeInfo?.feeStructure?.currency}
            >
              {studentWithFeeInfo?.feeStructure?.currency && (
                <Select.Option value={studentWithFeeInfo.feeStructure!.currency}>
                  {studentWithFeeInfo.feeStructure.currency}
                </Select.Option>
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <StatusSelectFormItem options={PAYMENT_STATUS_OPTIONS} />
        </Col>
      </Row>

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <TextArea
          rows={3}
          placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.REMARKS) })}
        />
      </Form.Item>
    </Card>
  );
}
