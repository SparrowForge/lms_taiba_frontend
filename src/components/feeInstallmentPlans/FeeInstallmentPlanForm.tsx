'use client';

import {Button, DatePicker, Form, Input, InputNumber, Select, Space} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';
import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useSemesters} from '@/hooks/useSemesters';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IFeeInstallmentPlanCreate, IFeeInstallmentPlanUpdate,} from '@/types/feeInstallmentPlan';

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
  const t = useTranslations();
  const entityName = t('feeInstallmentPlan');
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

  const handleSubmit = async (values: Partial<IFeeInstallmentPlanCreate | IFeeInstallmentPlanUpdate>) => {
    try {
      if (mode === 'create') {
        await createFeeInstallmentPlan(values as IFeeInstallmentPlanCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/fee-installment-plans');
        }
      } else if (mode === 'edit' && feeInstallmentPlanId) {
        await editFeeInstallmentPlan(feeInstallmentPlanId, values as IFeeInstallmentPlanUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/fee-installment-plans/${feeInstallmentPlanId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
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
      ? t('create_name', { name: entityName })
      : t('update_name', { name: entityName });

  const formContent = (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={mode === 'edit' ? {
      ...initialValues,
      dueDate: initialValues?.dueDate ? dayjs(initialValues.dueDate) : undefined,
    } : undefined}>
      <Form.Item
        name="feeStructureId"
        label={t('feeStructure', { defaultValue: 'Fee Structure' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Select
          placeholder={t('select_feeStructure', { defaultValue: 'Select Fee Structure' })}
          options={feeStructures.map((feeStructure) => ({
            label: feeStructure.templateName,
            value: feeStructure.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="semesterId"
        label={t('semester', { defaultValue: 'Semester' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Select
          placeholder={t('select_semester', { defaultValue: 'Select Semester' })}
          options={semesters.map((semester) => ({
            label: semester.name,
            value: semester.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="sequenceNo"
        label={t('sequenceNo', { defaultValue: 'Sequence No' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <InputNumber style={{ width: '100%' }} min={1} />
      </Form.Item>

      <Form.Item
        name="paymentLabel"
        label={t('paymentLabel', { defaultValue: 'Payment Label' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="durationMonths"
        label={t('durationMonths', { defaultValue: 'Duration (Months)' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <InputNumber style={{ width: '100%' }} min={1} />
      </Form.Item>

      <Form.Item
        name="amount"
        label={t('amount', { defaultValue: 'Amount' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={0.01}
        />
      </Form.Item>

      <Form.Item
        name="discountAmount"
        label={t('discountAmount', { defaultValue: 'Discount Amount' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={0.01}
        />
      </Form.Item>

      <Form.Item
        name="dueDate"
        label={t('dueDate', { defaultValue: 'Due Date' })}
        rules={[{ required: true, message: t('required_field', { defaultValue: 'This field is required' }) }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>{t('cancel')}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default FeeInstallmentPlanForm;
