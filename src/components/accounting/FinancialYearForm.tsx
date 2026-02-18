import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { IFinancialYear, IFinancialYearCreate, IFinancialYearUpdate } from '@/types/financialYear';
import { DatePicker, Form, Input, Modal, Radio } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

interface FinancialYearFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (values: IFinancialYearCreate | IFinancialYearUpdate) => void;
  initialValues?: IFinancialYear;
  loading?: boolean;
}

const FinancialYearForm: React.FC<FinancialYearFormProps> = ({
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
        yearName: initialValues.yearName,
        startDate: initialValues.startDate ? dayjs(initialValues.startDate) : null,
        endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
        isClosed: initialValues.isClosed,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        isClosed: 0, // Default to Open
      });
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload: any = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
      };
      onSuccess(payload);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        initialValues
          ? t(LOCALE_KEYS.EDIT_NAME, {
              name: t(LOCALE_KEYS.FINANCIAL_YEAR),
              defaultValue: 'Edit Financial Year',
            })
          : t(LOCALE_KEYS.CREATE_NAME, {
              name: t(LOCALE_KEYS.FINANCIAL_YEAR),
              defaultValue: 'Create Financial Year',
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
          name="yearName"
          label={t(LOCALE_KEYS.YEAR_NAME, { defaultValue: 'Year Name' })}
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                name: t(LOCALE_KEYS.YEAR_NAME),
                defaultValue: 'Please enter year name',
              }),
            },
          ]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.ENTER_YEAR_NAME, { defaultValue: 'e.g. FY 2025-26' })}
          />
        </Form.Item>

        <Form.Item
          name="startDate"
          label={t(LOCALE_KEYS.START_DATE, { defaultValue: 'Start Date' })}
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.REQUIRED_FIELD, { field: t(LOCALE_KEYS.START_DATE) }),
            },
          ]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label={t(LOCALE_KEYS.END_DATE, { defaultValue: 'End Date' })}
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.REQUIRED_FIELD, { field: t(LOCALE_KEYS.END_DATE) }),
            },
          ]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item name="isClosed" label={t(LOCALE_KEYS.STATUS, { defaultValue: 'Status' })}>
          <Radio.Group>
            <Radio value={0}>{t(LOCALE_KEYS.OPEN, { defaultValue: 'Open' })}</Radio>
            <Radio value={1}>{t(LOCALE_KEYS.CLOSED, { defaultValue: 'Closed' })}</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FinancialYearForm;
