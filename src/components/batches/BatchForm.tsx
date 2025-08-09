'use client';

import {Button, DatePicker, Form, Input, InputNumber, Select, Space} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import StatusSelect from '@/components/ui/StatusSelect';

import {useBatches} from '@/hooks/useBatches';
import {useCourses} from '@/hooks/useCourses';

import {IBatch, IBatchCreate, IBatchUpdate} from '@/types/batch';
import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import FormLayout from '../layout/FormLayout';


interface BatchFormProps {
  mode: 'create' | 'edit';
  batchId?: number;
  initialValues?: Partial<IBatchCreate | IBatchUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const BatchForm: React.FC<BatchFormProps> = ({
  mode,
  batchId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('batch');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createBatch, editBatch, actionStatus } = useBatches();
  const { courses, loadCourses } = useCourses();

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
  }, [loadCourses]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: (initialValues as IBatch)?.startDate
          ? dayjs((initialValues as IBatch).startDate as string)
          : (initialValues as IBatchUpdate)?.startDate
            ? dayjs((initialValues as IBatchUpdate).startDate as string)
            : undefined,
        endDate: (initialValues as IBatch)?.endDate
          ? dayjs((initialValues as IBatch).endDate as string)
          : (initialValues as IBatchUpdate)?.endDate
            ? dayjs((initialValues as IBatchUpdate).endDate as string)
            : undefined,
      });
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IBatch>) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate
          ? dayjs(values.startDate as unknown as string | Date).toISOString()
          : undefined,
        endDate: values.endDate
          ? dayjs(values.endDate as unknown as string | Date).toISOString()
          : undefined,
      };
      if (mode === 'create') {
        await createBatch(payload as IBatchCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/batches');
        }
      } else if (mode === 'edit' && batchId) {
        await editBatch(batchId, payload as IBatchUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/batches/${batchId}`);
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
      : t('edit_name', { name: entityName });

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="courseId"
        label={t('course')}
        rules={[{ required: true, message: t('required_name', { name: t('course') }) }]}
      >
        <Select
          showSearch
          placeholder={t('select_name', { name: t('course') })}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {courses.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name}
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
        name="year"
        label={t('year')}
        rules={[{ required: true, message: t('required_name', { name: t('year') }) }]}
      >
        <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="session"
        label={t('session')}
        rules={[{ required: true, message: t('required_name', { name: t('session') }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="intakeCapacity"
        label={t('intakeCapacity')}
        rules={[{ required: true, message: t('required_name', { name: t('intakeCapacity') }) }]}
      >
        <InputNumber min={1} max={10000} style={{ width: '100%' }} />
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
        <StatusSelect />
      </Form.Item>
      <Form.Item
        name="remarks"
        label={t('remarks')}
        rules={[{ required: true, message: t('required_name', { name: t('remarks') }) }]}
      >
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

export default BatchForm;
