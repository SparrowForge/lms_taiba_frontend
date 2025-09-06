'use client';

import {Button, DatePicker, Form, Input, InputNumber, Select, Space} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';
import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IFeeInstallmentPlanCreate, IFeeInstallmentPlanUpdate} from '@/types/feeInstallmentPlan';

import FormLayout from '../layout/FormLayout';

interface FeeInstallmentPlanFormProps {
  mode: 'create' | 'edit';
  feeInstallmentPlanId?: number;
  initialValues?: Partial<IFeeInstallmentPlanCreate | IFeeInstallmentPlanUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const FeeInstallmentPlanForm: React.FC<FeeInstallmentPlanFormProps> = ({
  mode,
  feeInstallmentPlanId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createFeeInstallmentPlan, editFeeInstallmentPlan, actionStatus } =
    useFeeInstallmentPlans();
  const { feeStructures, loadFeeStructures } = useFeeStructures();
  const { semesters, loadSemesters } = useSemesters();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadFeeStructures({ page: 1, limit: 100 });
    loadSemesters({ page: 1, limit: 100 });
  }, [loadFeeStructures, loadSemesters]);

  const handleSubmit = async (
    values: Partial<IFeeInstallmentPlanCreate | IFeeInstallmentPlanUpdate>,
  ) => {
    try {
      if (mode === 'create') {
        await createFeeInstallmentPlan(values as IFeeInstallmentPlanCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/fee-installment-plans');
        }
      } else if (mode === 'edit' && feeInstallmentPlanId) {
        await editFeeInstallmentPlan(feeInstallmentPlanId, values as IFeeInstallmentPlanUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/fee-installment-plans/${feeInstallmentPlanId}`);
        }
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
        // Use the helper function for other error types
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={
        mode === 'edit'
          ? {
              ...initialValues,
              dueDate: initialValues?.dueDate ? dayjs(initialValues.dueDate) : undefined,
            }
          : undefined
      }
    >
      <Form.Item
        name="feeStructureId"
        label={t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FEE_STRUCTURE) })}
          options={feeStructures.map((feeStructure) => ({
            label: feeStructure.templateName,
            value: feeStructure.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="semesterId"
        label={t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SEMESTER) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SEMESTER) })}
          options={semesters.map((semester) => ({
            label: semester.name,
            value: semester.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="sequenceNo"
        label={t(LOCALE_KEYS.SEQUENCE_NO, { defaultValue: 'Sequence No' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.SEQUENCE_NO) }),
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} min={1} />
      </Form.Item>

      <Form.Item
        name="paymentLabel"
        label={t(LOCALE_KEYS.PAYMENT_LABEL, { defaultValue: 'Payment Label' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PAYMENT_LABEL) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="durationMonths"
        label={t(LOCALE_KEYS.DURATION_MONTHS, { defaultValue: 'Duration (Months)' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DURATION_MONTHS) }),
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} min={1} />
      </Form.Item>

      <Form.Item
        name="amount"
        label={t(LOCALE_KEYS.AMOUNT, { defaultValue: 'Amount' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.AMOUNT) }),
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
      </Form.Item>

      <Form.Item
        name="discountAmount"
        label={t(LOCALE_KEYS.DISCOUNT_AMOUNT, { defaultValue: 'Discount Amount' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DISCOUNT_AMOUNT) }),
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
      </Form.Item>

      <Form.Item
        name="dueDate"
        label={t(LOCALE_KEYS.DUE_DATE, { defaultValue: 'Due Date' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DUE_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default FeeInstallmentPlanForm;
