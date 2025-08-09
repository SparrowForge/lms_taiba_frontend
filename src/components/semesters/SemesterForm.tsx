'use client';

import {Button, DatePicker, Form, Input, InputNumber, Select, Space} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import StatusSelect from '@/components/ui/StatusSelect';

import {useBatches} from '@/hooks/useBatches';
import {useSemesters} from '@/hooks/useSemesters';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {ISemester, ISemesterCreate, ISemesterUpdate} from '@/types/semester';

import FormLayout from '../layout/FormLayout';


interface SemesterFormProps {
  mode: 'create' | 'edit';
  semesterId?: number;
  initialValues?: Partial<ISemesterCreate | ISemesterUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const SemesterForm: React.FC<SemesterFormProps> = ({
  mode,
  semesterId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('semester');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createSemester, editSemester, actionStatus } = useSemesters();
  const { batches, loadBatches } = useBatches();

  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
  }, [loadBatches]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startDate ? dayjs(initialValues.startDate) : undefined,
        endDate: initialValues.endDate ? dayjs(initialValues.endDate) : undefined,
      });
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<ISemester>) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate ? dayjs(values.startDate).toISOString() : undefined,
        endDate: values.endDate ? dayjs(values.endDate).toISOString() : undefined,
      };
      if (mode === 'create') {
        await createSemester(payload as ISemesterCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/semesters');
        }
      } else if (mode === 'edit' && semesterId) {
        await editSemester(semesterId, payload as ISemesterUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/semesters/${semesterId}`);
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
      initialValues={{
        ...initialValues,
        startDate: initialValues?.startDate ? dayjs(initialValues.startDate) : undefined,
        endDate: initialValues?.endDate ? dayjs(initialValues.endDate) : undefined,
      }}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="batchId"
        label={t('batch')}
        rules={[{ required: true, message: t('required_name', { name: t('batch') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('batch') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {batches.map((batch) => (
            <Select.Option key={batch.id} value={batch.id}>
              {batch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('required_name', { name: t('name') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="termNo"
        label={t('termNo')}
        rules={[{ required: true, message: t('required_name', { name: t('termNo') }) }]}
      >
        <InputNumber min={1} max={20} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="startDate"
        label={t('startDate')}
        rules={[{ required: true, message: t('required_name', { name: t('startDate') }) }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="endDate"
        label={t('endDate')}
        rules={[{ required: true, message: t('required_name', { name: t('endDate') }) }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="status"
        label={t('status')}
        rules={[{ required: true, message: t('required_name', { name: t('status') }) }]}
      >
        <StatusSelect preset="lifecycle" />
      </Form.Item>
      <Form.Item name="remarks" label={t('remarks')}>
        <Input.TextArea rows={3} />
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

export default SemesterForm;
