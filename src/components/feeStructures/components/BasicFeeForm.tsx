import {Button, Card, Col, Form, Input, InputNumber, Row, Select} from 'antd';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useBatches} from '@/hooks/useBatches';
import {useLocalization} from '@/hooks/useLocalization';

interface BasicFeeFormProps {
  form: any;
  onFinish: (values: any) => void;
  loading?: boolean;
}

const BasicFeeForm: React.FC<BasicFeeFormProps> = ({ form, onFinish, loading = false }) => {
  const { t } = useLocalization();
  const { batches, listStatus } = useBatches();

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t(LOCALE_KEYS.NAME)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
                },
              ]}
            >
              <Input placeholder={t(LOCALE_KEYS.ENTER_NAME)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="batchId"
              label={t(LOCALE_KEYS.BATCH)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BATCH) }),
                },
              ]}
            >
              <Select
                placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })}
                loading={listStatus.status === Status.LOADING}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {batches.map((batch) => (
                  <Select.Option key={batch.id} value={batch.id}>
                    {batch.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="totalFees"
              label={t(LOCALE_KEYS.TOTAL_FEES)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TOTAL_FEES) }),
                },
              ]}
            >
              <InputNumber
                placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="admissionFee" label={t(LOCALE_KEYS.ADMISSION_FEE)}>
              <InputNumber
                placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="discountAmount" label={t(LOCALE_KEYS.DISCOUNT_AMOUNT)}>
              <InputNumber
                placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="paymentType"
              label={t(LOCALE_KEYS.PAYMENT_TYPE)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PAYMENT_TYPE) }),
                },
              ]}
            >
              <Select placeholder={t(LOCALE_KEYS.SELECT_PAYMENT_TYPE)}>
                <Select.Option value="one_time">{t(LOCALE_KEYS.ONE_TIME)}</Select.Option>
                <Select.Option value="installment">{t(LOCALE_KEYS.INSTALLMENT)}</Select.Option>
                <Select.Option value="monthly">{t(LOCALE_KEYS.MONTHLY)}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {t(LOCALE_KEYS.CREATE_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) })}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BasicFeeForm;
