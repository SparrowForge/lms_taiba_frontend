'use client';

import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useFeeInstallmentPlans } from '@/hooks/useFeeInstallmentPlans';
import { useFeePaymentDetails } from '@/hooks/useFeePaymentDetails';
import { useLocalization } from '@/hooks/useLocalization';

import { getErrorMessage } from '@/types/errors';
import {
  IFeePaymentDetails,
  IFeePaymentDetailsCreate,
  IFeePaymentDetailsUpdate,
} from '@/types/feePaymentDetails';

import FormLayout from '../layout/FormLayout';

interface FeePaymentDetailsFormProps {
  mode: 'create' | 'edit';
  feePaymentDetailId?: number;
  initialValues?: Partial<IFeePaymentDetailsCreate | IFeePaymentDetailsUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const FeePaymentDetailsForm: React.FC<FeePaymentDetailsFormProps> = ({
  mode,
  feePaymentDetailId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createFeePaymentDetail, editFeePaymentDetail, actionStatus } = useFeePaymentDetails();
  const { feeInstallmentPlans, loadFeeInstallmentPlans } = useFeeInstallmentPlans();

  // Load fee installment plans on component mount
  useEffect(() => {
    if (feeInstallmentPlans.length === 0) {
      loadFeeInstallmentPlans();
    }
  }, [feeInstallmentPlans.length, loadFeeInstallmentPlans]);

  // Form reset on create mode
  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IFeePaymentDetails>) => {
    try {
      if (mode === 'create') {
        await createFeePaymentDetail(values as IFeePaymentDetailsCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/fee-payment-details');
      } else if (mode === 'edit' && feePaymentDetailId) {
        await editFeePaymentDetail(feePaymentDetailId, values as IFeePaymentDetailsUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/fee-payment-details/${feePaymentDetailId}`);
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  // Submit button text helper
  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  // Form initial values only for edit mode
  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="paymentId"
            label={t(LOCALE_KEYS.PAYMENT_ID, { defaultValue: 'Payment ID' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PAYMENT_ID) }),
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.PAYMENT_ID) })}
              min={1}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="feeInstallmentPlanId"
            label={t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN),
                }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, {
                name: t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN),
              })}
              loading={feeInstallmentPlans.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {feeInstallmentPlans.map((plan) => (
                <Select.Option key={plan.id} value={plan.id}>
                  {plan.paymentLabel} (Sequence: {plan.sequenceNo})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="feeTitle"
        label={t(LOCALE_KEYS.FEE_TITLE, { defaultValue: 'Fee Title' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FEE_TITLE) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.FEE_TITLE) })} />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="amountDue"
            label={t(LOCALE_KEYS.AMOUNT_DUE, { defaultValue: 'Amount Due' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.AMOUNT_DUE) }),
              },
              {
                type: 'number',
                min: 0,
                message: 'Amount due must be 0 or greater',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
              min={0}
              step={0.01}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="amountPaid"
            label={t(LOCALE_KEYS.AMOUNT_PAID)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.AMOUNT_PAID) }),
              },
              {
                type: 'number',
                min: 0,
                message: 'Amount paid must be 0 or greater',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
              min={0}
              step={0.01}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="balanceAmount"
            label={t(LOCALE_KEYS.BALANCE_AMOUNT, { defaultValue: 'Balance Amount' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BALANCE_AMOUNT) }),
              },
              {
                type: 'number',
                min: 0,
                message: 'Balance amount must be 0 or greater',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
              min={0}
              step={0.01}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default FeePaymentDetailsForm;
