'use client';

import {Button, DatePicker, Form, Input, InputNumber, Select, Space} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import StatusSelect from '@/components/ui/StatusSelect';

import {useBatches} from '@/hooks/useBatches';
import {useCourses} from '@/hooks/useCourses';
import {useLocalization} from '@/hooks/useLocalization';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createBatch, editBatch, actionStatus } = useBatches();
  const { courses, loadCourses } = useCourses();

  useEffect(() => {
    loadCourses({ page: 1, limit: 100 });
  }, [loadCourses]);

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
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/batches');
        }
      } else if (mode === 'edit' && batchId) {
        await editBatch(batchId, payload as IBatchUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/batches/${batchId}`);
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
      initialValues={mode === 'edit' ? {
        ...initialValues,
        startDate: initialValues?.startDate ? dayjs(initialValues.startDate) : undefined,
        endDate: initialValues?.endDate ? dayjs(initialValues.endDate) : undefined,
      } : undefined}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="courseId"
        label={t(LOCALE_KEYS.COURSE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.COURSE) }) }]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) })}
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
        label={t(LOCALE_KEYS.NAME)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.NAME) }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="year"
        label={t(LOCALE_KEYS.YEAR)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.YEAR) }) }]}
      >
        <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="session"
        label={t(LOCALE_KEYS.SESSION)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.SESSION) }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="intakeCapacity"
        label={t(LOCALE_KEYS.INTAKE_CAPACITY)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.INTAKE_CAPACITY) }) }]}
      >
        <InputNumber min={1} max={10000} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="startDate"
        label={t(LOCALE_KEYS.START_DATE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.START_DATE) }) }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="endDate"
        label={t(LOCALE_KEYS.END_DATE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.END_DATE) }) }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.STATUS) }) }]}
      >
        <StatusSelect />
      </Form.Item>
      <Form.Item
        name="remarks"
        label={t(LOCALE_KEYS.REMARKS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.REMARKS) }) }]}
      >
        <Input.TextArea rows={3} />
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
  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default BatchForm;
