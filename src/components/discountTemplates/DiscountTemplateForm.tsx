'use client';

import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useDiscountTemplates } from '@/hooks/useDiscountTemplates';

import { getErrorMessage } from '@/types/errors';
import {
  IDiscountTemplate,
  IDiscountTemplateCreate,
  IDiscountTemplateUpdate,
} from '@/types/discountTemplate';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';

interface DiscountTemplateFormProps {
  mode: 'create' | 'edit';
  discountTemplateId?: number;
  initialValues?: Partial<IDiscountTemplateCreate | IDiscountTemplateUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const DiscountTemplateForm: React.FC<DiscountTemplateFormProps> = ({
  mode,
  discountTemplateId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DISCOUNT_TEMPLATE, { defaultValue: 'Discount Template' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createDiscountTemplate, editDiscountTemplate, actionStatus } = useDiscountTemplates();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IDiscountTemplate>) => {
    try {
      if (mode === 'create') {
        await createDiscountTemplate(values as IDiscountTemplateCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/discount-templates');
        }
      } else if (mode === 'edit' && discountTemplateId) {
        await editDiscountTemplate(discountTemplateId, values as IDiscountTemplateUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/discount-templates');
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
      onFinish={handleSubmit}
      initialValues={
        mode === 'edit'
          ? initialValues
          : {
              status: 'active',
              type: 'percent',
            }
      }
    >
      <Form.Item
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: entityName }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.NAME)} />
      </Form.Item>

      <Form.Item
        name="type"
        label={t(LOCALE_KEYS.TYPE, { defaultValue: 'Type' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_STATUS, {
              name: t(LOCALE_KEYS.TYPE, { defaultValue: 'Type' }),
            }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, {
            name: t(LOCALE_KEYS.TYPE, { defaultValue: 'Type' }),
          })}
        >
          <Select.Option value="percent">Percent</Select.Option>
          <Select.Option value="fixed">Fixed</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label={t(LOCALE_KEYS.DISCOUNT_AMOUNT, { defaultValue: 'Discount Amount' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
              name: t(LOCALE_KEYS.DISCOUNT_AMOUNT, { defaultValue: 'Discount Amount' }),
            }),
          },
          {
            type: 'number',
            min: 0,
            message: 'Amount must be at least 0',
          },
        ]}
      >
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.DISCOUNT_AMOUNT, { defaultValue: 'Discount Amount' })}
        />
      </Form.Item>

      <Form.Item
        name="remarks"
        label={t(LOCALE_KEYS.REMARKS, { defaultValue: 'Remarks' })}
        rules={[
          {
            max: 500,
            message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_NAME, {
              name: t(LOCALE_KEYS.REMARKS, { defaultValue: 'Remarks' }),
            }),
          },
        ]}
      >
        <Input.TextArea
          rows={3}
          placeholder={t(LOCALE_KEYS.REMARKS, { defaultValue: 'Remarks' })}
        />
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

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

export default DiscountTemplateForm;

