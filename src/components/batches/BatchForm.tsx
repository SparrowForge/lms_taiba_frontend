'use client';

import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useBatches } from '@/hooks/useBatches';
import { useCourses } from '@/hooks/useCourses';
import { IBatch, IBatchCreate, IBatchUpdate } from '@/types/batch';
import { Status } from '@/types/common';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { getErrorMessage } from '@/types/errors';

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
  embedded = false
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
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IBatch>) => {
    try {
      if (mode === 'create') {
        await createBatch(values as IBatchCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/batches');
        }
      } else if (mode === 'edit' && batchId) {
        await editBatch(batchId, values as IBatchUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/batches/${batchId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', { name: entityName, defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}` });
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

  const getSubmitText = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

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
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())}
        >
          {courses.map(course => (
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
  )
  return embedded ? formContent : (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {formContent}
      </div>
    </div>
  );
};

export default BatchForm; 