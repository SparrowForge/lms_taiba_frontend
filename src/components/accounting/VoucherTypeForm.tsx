import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { IVoucherType, IVoucherTypeCreate, IVoucherTypeUpdate } from '@/types/voucherType';
import { Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

interface VoucherTypeFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (values: IVoucherTypeCreate | IVoucherTypeUpdate) => void;
  initialValues?: IVoucherType;
  loading?: boolean;
}

const VoucherTypeForm: React.FC<VoucherTypeFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const { t } = useLocalization();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSuccess(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        initialValues
          ? t(LOCALE_KEYS.EDIT_NAME, {
              name: t(LOCALE_KEYS.VOUCHER_TYPE),
              defaultValue: 'Edit Voucher Type',
            })
          : t(LOCALE_KEYS.CREATE_NAME, {
              name: t(LOCALE_KEYS.VOUCHER_TYPE),
              defaultValue: 'Create Voucher Type',
            })
      }
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText={t(LOCALE_KEYS.OK, { defaultValue: 'OK' })}
      cancelText={t(LOCALE_KEYS.CANCEL, { defaultValue: 'Cancel' })}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={t(LOCALE_KEYS.NAME, { defaultValue: 'Name' })}
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.REQUIRED_NAME, {
                name: t(LOCALE_KEYS.VOUCHER_TYPE),
                defaultValue: 'Voucher Type is required',
              }),
            },
          ]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.ENTER_VOUCHER_TYPE_NAME, {
              defaultValue: 'Enter voucher type name',
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoucherTypeForm;
