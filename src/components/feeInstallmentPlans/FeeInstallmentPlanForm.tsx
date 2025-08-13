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
      due_date: initialValues?.due_date ? dayjs(initialValues.due_date) : undefined,
    } : undefined}>
      {mode === 'create' && (
        <>
          <Form.Item
            name="fee_structure_id"
            label={t('feeStructure')}
            rules={[{ required: true, message: t('required_field', { field: t('feeStructure') }) }]}
          >
            <Select
              placeholder={t('select_feeStructure')}
              loading={feeStructures.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {feeStructures.map((feeStructure) => (
                <Select.Option key={feeStructure.id} value={feeStructure.id}>
                  {feeStructure.template_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="semester_id"
            label={t('semester')}
            rules={[{ required: true, message: t('required_field', { field: t('semester') }) }]}
          >
            <Select
              placeholder={t('select_semester')}
              loading={semesters.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {semesters.map((semester) => (
                <Select.Option key={semester.id} value={semester.id}>
                  {semester.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item
        name="sequence_no"
        label={t('sequenceNo')}
        rules={[{ required: true, message: t('required_field', { field: t('sequenceNo') }) }]}
      >
        <InputNumber
          placeholder={t('enter_sequenceNo')}
          min={1}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="payment_label"
        label={t('paymentLabel')}
        rules={[{ required: true, message: t('required_field', { field: t('paymentLabel') }) }]}
      >
        <Input placeholder={t('enter_paymentLabel')} />
      </Form.Item>

      <Form.Item
        name="duration_months"
        label={t('durationMonths')}
        rules={[{ required: true, message: t('required_field', { field: t('durationMonths') }) }]}
      >
        <InputNumber
          placeholder={t('enter_durationMonths')}
          min={1}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="amount"
        label={t('amount')}
        rules={[{ required: true, message: t('required_field', { field: t('amount') }) }]}
      >
        <InputNumber
          placeholder={t('enter_amount')}
          min={0}
          step={0.01}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="discount_amount"
        label={t('discountAmount')}
      >
        <InputNumber
          placeholder={t('enter_discountAmount')}
          min={0}
          step={0.01}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="due_date"
        label={t('dueDate')}
        rules={[{ required: true, message: t('required_field', { field: t('dueDate') }) }]}
      >
        <DatePicker
          placeholder={t('select_dueDate')}
          style={{ width: '100%' }}
        />
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
