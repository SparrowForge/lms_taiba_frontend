'use client';

import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {useBatches} from '@/hooks/useBatches';
import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useSemesters} from '@/hooks/useSemesters';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IFeeStructure, IFeeStructureCreate, IFeeStructureUpdate} from '@/types/feeStructure';

import FormLayout from '../layout/FormLayout';

interface FeeStructureFormProps {
  mode: 'create' | 'edit';
  feeStructureId?: number;
  initialValues?: Partial<IFeeStructureCreate | IFeeStructureUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const FeeStructureForm: React.FC<FeeStructureFormProps> = ({
  mode,
  feeStructureId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('feeStructure');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createFeeStructure, editFeeStructure, actionStatus } = useFeeStructures();
  const { batches, loadBatches } = useBatches();
  const { semesters, loadSemesters } = useSemesters();
  const [selectedBatchId, setSelectedBatchId] = useState<number | undefined>(initialValues?.batchId);

  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
    loadSemesters({ page: 1, limit: 100 });
  }, [loadBatches, loadSemesters]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
      setSelectedBatchId(undefined);
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IFeeStructure>) => {
    try {
      const payload = { ...values };
      if (mode === 'create') {
        await createFeeStructure(payload as IFeeStructureCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/fee-structures');
        }
      } else if (mode === 'edit' && feeStructureId) {
        await editFeeStructure(feeStructureId, payload as IFeeStructureUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/fee-structures/${feeStructureId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });
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
    <Form
      form={form}
      layout="vertical"
      initialValues={mode === 'edit' ? initialValues : undefined}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="templateName"
        label={t('templateName')}
        rules={[{ required: true, message: t('required_field', { field: t('templateName') }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="batchId"
        label={t('batch')}
        rules={[{ required: true, message: t('required_field', { field: t('batch') }) }]}
      >
        <Select
          placeholder={t('select_batch')}
          onChange={(value) => setSelectedBatchId(value)}
          showSearch
          filterOption={(input, option) =>
            String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        >
          {batches.map((batch) => (
            <Select.Option key={batch.id} value={batch.id} label={batch.name}>
              {batch.name}
            </Select.Option>
          ))}
        </Select>
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
        name="academicYear"
        label={t('academicYear')}
        rules={[{ required: true, message: t('required_field', { field: t('academicYear') }) }]}
      >
        <Input placeholder="e.g., 2025-2026" />
      </Form.Item>

      <Form.Item
        name="paymentType"
        label={t('paymentType')}
        rules={[{ required: true, message: t('required_field', { field: t('paymentType') }) }]}
      >
        <Select placeholder={t('select_paymentType')}>
          <Select.Option value="one_time">{t('oneTime')}</Select.Option>
          <Select.Option value="installment">{t('installment')}</Select.Option>
          <Select.Option value="monthly">{t('monthly')}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="totalFees"
        label={t('totalFees')}
        rules={[{ required: true, message: t('required_field', { field: t('totalFees') }) }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={0.01}
          placeholder="0.00"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </Form.Item>

      <Form.Item
        name="admissionFee"
        label={t('admissionFee')}
        rules={[{ required: true, message: t('required_field', { field: t('admissionFee') }) }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={0.01}
          placeholder="0.00"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </Form.Item>

      <Form.Item
        name="discountType"
        label={t('discountType')}
        rules={[{ required: true, message: t('required_field', { field: t('discountType') }) }]}
      >
        <Select placeholder={t('select_discountType')}>
          <Select.Option value="percent">{t('percent')}</Select.Option>
          <Select.Option value="fixed">{t('fixed')}</Select.Option>
          <Select.Option value="none">{t('none')}</Select.Option>
        </Select>
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
        name="currency"
        label={t('currency')}
        rules={[{ required: true, message: t('required_field', { field: t('currency') }) }]}
      >
        <Select placeholder={t('select_currency')}>
          <Select.Option value="SAR">SAR</Select.Option>
          <Select.Option value="USD">USD</Select.Option>
          <Select.Option value="EUR">EUR</Select.Option>
          <Select.Option value="GBP">GBP</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="remarks"
        label={t('remarks')}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="status"
        label={t('status')}
        rules={[{ required: true, message: t('required_field', { field: t('status') }) }]}
      >
        <Select placeholder={t('select_status')}>
          <Select.Option value="active">{t('active')}</Select.Option>
          <Select.Option value="inactive">{t('inactive')}</Select.Option>
          <Select.Option value="draft">{t('draft')}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
            {t('cancel')}
          </Button>
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

export default FeeStructureForm;
