'use client';

import {Button, DatePicker, Form, Input, InputNumber, Select, Space, Switch} from 'antd';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import StatusSelect from '@/components/ui/StatusSelect';

import {useBatches} from '@/hooks/useBatches';
import {useLocalization} from '@/hooks/useLocalization';
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createSemester, editSemester, actionStatus } = useSemesters();
  const { batches, loadBatches } = useBatches();

  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
  }, [loadBatches]);

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
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/semesters');
        }
      } else if (mode === 'edit' && semesterId) {
        await editSemester(semesterId, payload as ISemesterUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/semesters/${semesterId}`);
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
      initialValues={
        mode === 'edit'
          ? {
              ...initialValues,
              startDate: initialValues?.startDate ? dayjs(initialValues.startDate) : undefined,
              endDate: initialValues?.endDate ? dayjs(initialValues.endDate) : undefined,
            }
          : undefined
      }
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Form.Item
        name="batchId"
        label={t(LOCALE_KEYS.BATCH)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.BATCH) }),
          },
        ]}
      >
        <Select
          showSearch
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })}
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
        name="termNo"
        label={t(LOCALE_KEYS.TERM_NO)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TERM_NO) }),
          },
        ]}
      >
        <InputNumber min={1} max={20} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="startDate"
        label={t(LOCALE_KEYS.START_DATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.START_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="endDate"
        label={t(LOCALE_KEYS.END_DATE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.END_DATE) }),
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STATUS) }),
          },
        ]}
      >
        <StatusSelect preset="lifecycle" />
      </Form.Item>
      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="isBreak" label={t(LOCALE_KEYS.IS_BREAK)}>
        <Switch />
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

export default SemesterForm;
