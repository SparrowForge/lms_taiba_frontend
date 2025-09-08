'use client';

import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useAddresses} from '@/hooks/useAddresses';
import {useLocalization} from '@/hooks/useLocalization';

import {IAddress, IAddressCreate, IAddressUpdate} from '@/types/address';
import {getErrorMessage} from '@/types/errors';

import FormLayout from '../layout/FormLayout';

interface AddressFormProps {
  mode: 'create' | 'edit';
  addressId?: number;
  initialValues?: Partial<IAddress>;
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ADDRESS, { defaultValue: 'Address' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createAddress, editAddress, actionStatus } = useAddresses();

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
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/addresses');
        }
      } else if (mode === 'edit' && addressId) {
        await editAddress(addressId, payload as IAddressUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/addresses/${addressId}`);
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
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label={t(LOCALE_KEYS.ADDRESS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADDRESS) }),
          },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        name="city"
        label={t(LOCALE_KEYS.CITY)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CITY) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="state"
        label={t(LOCALE_KEYS.STATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STATE) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="zipCode"
        label={t(LOCALE_KEYS.ZIP_CODE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ZIP_CODE) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="country"
        label={t(LOCALE_KEYS.COUNTRY)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.COUNTRY) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label={t(LOCALE_KEYS.PHONE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PHONE) }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={t(LOCALE_KEYS.EMAIL)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMAIL) }),
          },
        ]}
      >
        <Input />
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

export default AddressForm;
