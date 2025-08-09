'use client';

import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {useAddresses} from '@/hooks/useAddresses';

import {IAddress, IAddressCreate, IAddressUpdate} from '@/types/address';
import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import FormLayout from '../layout/FormLayout';

interface AddressFormProps {
  mode: 'create' | 'edit';
  addressId?: number;
  initialValues?: Partial<IAddressCreate | IAddressUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  mode,
  addressId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('address');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createAddress, editAddress, actionStatus } = useAddresses();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({ ...initialValues });
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IAddress>) => {
    try {
      const payload = { ...values };
      if (mode === 'create') {
        await createAddress(payload as IAddressCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/addresses');
        }
      } else if (mode === 'edit' && addressId) {
        await editAddress(addressId, payload as IAddressUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/addresses/${addressId}`);
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
      initialValues={initialValues}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('required_name', { name: t('name') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label={t('address')}
        rules={[{ required: true, message: t('required_name', { name: t('address') }) }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        name="city"
        label={t('city')}
        rules={[{ required: true, message: t('required_name', { name: t('city') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="state"
        label={t('state')}
        rules={[{ required: true, message: t('required_name', { name: t('state') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="zipCode"
        label={t('zipCode')}
        rules={[{ required: true, message: t('required_name', { name: t('zipCode') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="country"
        label={t('country')}
        rules={[{ required: true, message: t('required_name', { name: t('country') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label={t('phone')}
        rules={[{ required: true, message: t('required_name', { name: t('phone') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={t('email')}
        rules={[{ required: true, message: t('required_name', { name: t('email') }) }]}
      >
        <Input />
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

export default AddressForm;
