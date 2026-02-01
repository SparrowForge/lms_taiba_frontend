'use client';

import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { INSTITUTE_TYPE_OPTIONS } from '@/constants/instituteTypes';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useAddresses } from '@/hooks/useAddresses';
import { useInstitutes } from '@/hooks/useInstitutes';
import { useLocalization } from '@/hooks/useLocalization';

import { getErrorMessage } from '@/types/errors';
import { IInstitute, IInstituteCreate, IInstituteUpdate } from '@/types/institute';

import AddressFormDrawer from '../addresses/AddressFormDrawer';
import FormLayout from '../layout/FormLayout';
import QuickAddDrawerButton from '../ui/QuickAddDrawerButton';
import { StatusSelectFormItem } from '../ui/StatusSelect';
import { IAddress } from '@/types/address';

interface Props {
  mode: 'create' | 'edit';
  instituteId?: number;
  initialValues?: Partial<IInstituteCreate | IInstituteUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const InstituteForm: React.FC<Props> = ({
  mode,
  instituteId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.INSTITUTE, { defaultValue: 'Institute' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createInstitute, editInstitute, actionStatus } = useInstitutes();
  const { addresses, loadAddresses } = useAddresses();

  useEffect(() => {
    if (mode === 'create') form.resetFields();
    loadAddresses();
  }, [mode, form, loadAddresses]);

  const handleSubmit = async (values: Partial<IInstitute>) => {
    try {
      if (mode === 'create') {
        await createInstitute(values as IInstituteCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push('/institutes');
      } else if (mode === 'edit' && instituteId) {
        await editInstitute(instituteId, values as IInstituteUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) onSuccess();
        else router.push(`/institutes/${instituteId}`);
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) errorMessage = apiError.response.data.message;
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
        name="code"
        label={t(LOCALE_KEYS.INSTITUTE_CODE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.INSTITUTE_CODE) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="type"
        label={t(LOCALE_KEYS.INSTITUTE_TYPE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.INSTITUTE_TYPE) }),
          },
        ]}
      >
        <Select
          options={INSTITUTE_TYPE_OPTIONS}
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.INSTITUTE_TYPE) })}
        />
      </Form.Item>

      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="addressId"
            label={t(LOCALE_KEYS.ADDRESS)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADDRESS) }),
              },
            ]}
          >
            <Select
            showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              placeholder={t(LOCALE_KEYS.SELECT_NAME, {
                name: t(LOCALE_KEYS.ADDRESS),
              })}
              style={{ width: '100%' }}
            >
              {addresses.map((addr:IAddress) => (
                <Select.Option key={addr.id} value={addr.id}>
                  {addr?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddDrawerButton
              drawerComponent={AddressFormDrawer}
              drawerProps={{ mode: 'create' }}
              onComplete={async (data) => {
                await loadAddresses();
                if (data?.id) {
                  form.setFieldsValue({ addressId: data.id });
                }
              }}
              iconOnly
              buttonType="dashed"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="website"
        required
        label={t(LOCALE_KEYS.WEBSITE)}
        rules={[
          {
            type: 'url',
            message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_NAME, { name: t(LOCALE_KEYS.WEBSITE) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="institutionCode"
        label={t(LOCALE_KEYS.INSTITUTION_CODE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.INSTITUTION_CODE) }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

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

export default InstituteForm;
