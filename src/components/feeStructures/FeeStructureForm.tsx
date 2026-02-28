'use client';

import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CURRENCIES } from '@/constants/currencies';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { PAYMENT_TYPE_OPTIONS, Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useFeeStructures } from '@/hooks/useFeeStructures';
import { useLocalization } from '@/hooks/useLocalization';
import { useSemesters } from '@/hooks/useSemesters';

import { getErrorMessage } from '@/types/errors';
import { IFeeStructure, IFeeStructureCreate, IFeeStructureUpdate } from '@/types/feeStructure';

import FormLayout from '../layout/FormLayout';
import { StatusSelect, StatusSelectFormItem } from '../ui/StatusSelect';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createFeeStructure, editFeeStructure, actionStatus } = useFeeStructures();
  const { batches, loadBatches } = useBatches();
  const { semesters, loadSemesters } = useSemesters();
  const [selectedBatchId, setSelectedBatchId] = useState<number | undefined>(
    initialValues?.batchId,
  );

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
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/fee-structures');
        }
      } else if (mode === 'edit' && feeStructureId) {
        await editFeeStructure(feeStructureId, payload as IFeeStructureUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/fee-structures/${feeStructureId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
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
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

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
        label={t(LOCALE_KEYS.TEMPLATE_NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TEMPLATE_NAME) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

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
          onChange={(value) => setSelectedBatchId(value)}
          showSearch
          filterOption={(input, option) =>
            String(option?.label ?? '')
              .toLowerCase()
              .includes(input.toLowerCase())
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
        name="academicYear"
        label={t(LOCALE_KEYS.ACADEMIC_YEAR)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ACADEMIC_YEAR) }),
          },
        ]}
      >
        <Input placeholder="e.g., 2025-2026" />
      </Form.Item>

      <Form.Item
        name="paymentType"
        label={t(LOCALE_KEYS.PAYMENT_TYPE)}
        initialValue={PAYMENT_TYPE_OPTIONS[0]?.value}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PAYMENT_TYPE) }),
          },
        ]}
      >
        <StatusSelect options={PAYMENT_TYPE_OPTIONS} />
      </Form.Item>

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
          style={{ width: '100%' }}
          min={0}
          step={0.01}
          placeholder="0.00"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </Form.Item>

      <Form.Item
        name="admissionFee"
        label={t(LOCALE_KEYS.ADMISSION_FEE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADMISSION_FEE) }),
          },
        ]}
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
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
          placeholder={t(LOCALE_KEYS.SELECT_CURRENCY)}
        >
          {CURRENCIES.map((currency) => (
            <Select.Option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name} ({currency.symbol})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <Input.TextArea rows={3} />
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />
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

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default FeeStructureForm;
