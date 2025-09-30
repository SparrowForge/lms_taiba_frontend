'use client';

import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { CURRENCIES } from '@/constants/currencies';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';
import { PAYMENT_MODE_OPTIONS, PAYMENT_STATUS_OPTIONS } from '@/enums/payment.enum';

import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections';
import { useFeeStructures } from '@/hooks/useFeeStructures';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { getErrorMessage } from '@/types/errors';
import {
  IFeePaymentCollection,
  IFeePaymentCollectionCreate,
  IFeePaymentCollectionUpdate,
} from '@/types/feePaymentCollection';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';

const { TextArea } = Input;

interface FeePaymentCollectionFormProps {
  mode: 'create' | 'edit';
  feePaymentCollectionId?: number;
  initialValues?: Partial<IFeePaymentCollectionCreate | IFeePaymentCollectionUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const FeePaymentCollectionForm: React.FC<FeePaymentCollectionFormProps> = ({
  mode,
  feePaymentCollectionId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
    defaultValue: 'Fee Payment Collection',
  });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createFeePaymentCollection, editFeePaymentCollection, actionStatus } =
    useFeePaymentCollections();
  const { students, loadStudents } = useStudents();
  const { feeStructures, loadFeeStructures } = useFeeStructures();

  // Load students and fee structures on component mount
  useEffect(() => {
    if (students.length === 0) {
      loadStudents();
    }
    if (feeStructures.length === 0) {
      loadFeeStructures();
    }
  }, [students.length, feeStructures.length, loadStudents, loadFeeStructures]);

  // Form reset on create mode
  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IFeePaymentCollection>) => {
    try {
      if (mode === 'create') {
        await createFeePaymentCollection(values as IFeePaymentCollectionCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/fee-payment-collections');
      } else if (mode === 'edit' && feePaymentCollectionId) {
        await editFeePaymentCollection(
          feePaymentCollectionId,
          values as IFeePaymentCollectionUpdate,
        );
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/fee-payment-collections/${feePaymentCollectionId}`);
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
      initialValues={
        mode === 'edit'
          ? {
              ...initialValues,
              paymentDate: initialValues?.paymentDate
                ? dayjs(initialValues.paymentDate)
                : undefined,
            }
          : undefined
      }
      disabled={actionStatus.status === Status.LOADING}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="studentId"
            label={t(LOCALE_KEYS.STUDENT)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STUDENT) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.STUDENT) })}
              loading={students.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {students.map((student) => (
                <Select.Option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.applicationNo})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="feeStructureId"
            label={t(LOCALE_KEYS.FEE_STRUCTURE)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) })}
              loading={feeStructures.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {feeStructures.map((feeStructure) => (
                <Select.Option key={feeStructure.id} value={feeStructure.id}>
                  {feeStructure.templateName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="paymentDate"
            label={t(LOCALE_KEYS.PAYMENT_DATE, { defaultValue: 'Payment Date' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PAYMENT_DATE) }),
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
        <Col span={12}>
          <Form.Item
            name="paymentMode"
            label={t(LOCALE_KEYS.PAYMENT_MODE, { defaultValue: 'Payment Mode' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PAYMENT_MODE) }),
              },
            ]}
          >
            <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.PAYMENT_MODE) })}>
              {PAYMENT_MODE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {t(option.labelKey as any)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="transactionRef"
            label={t(LOCALE_KEYS.TRANSACTION_REF, { defaultValue: 'Transaction Reference' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TRANSACTION_REF) }),
              },
            ]}
          >
            <Input
              placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.TRANSACTION_REF) })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="amountPaid"
            label={t(LOCALE_KEYS.AMOUNT_PAID, { defaultValue: 'Amount Paid' })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.AMOUNT_PAID) }),
              },
              {
                type: 'number',
                min: 0.01,
                message: 'Amount must be greater than 0',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder={t(LOCALE_KEYS.ENTER_AMOUNT)}
              min={0.01}
              step={0.01}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
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
            <Select placeholder={t(LOCALE_KEYS.SELECT_CURRENCY)}>
              {CURRENCIES.map((currency) => (
                <Select.Option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <StatusSelectFormItem options={PAYMENT_STATUS_OPTIONS} />
        </Col>
      </Row>

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <TextArea
          rows={3}
          placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.REMARKS) })}
        />
      </Form.Item>

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

export default FeePaymentCollectionForm;
