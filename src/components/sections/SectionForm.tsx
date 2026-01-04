'use client';

import { Button, Form, Input, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import { useBatches } from '@/hooks/useBatches';
import { useLocalization } from '@/hooks/useLocalization';
import { useSections } from '@/hooks/useSections';

import { ISection, ISectionCreate, ISectionUpdate } from '@/types/section';
import { getErrorMessage } from '@/types/errors';

import FormLayout from '../layout/FormLayout';
import { StatusSelectFormItem } from '../ui/StatusSelect';

const { TextArea } = Input;

interface SectionFormProps {
  mode: 'create' | 'edit';
  sectionId?: number;
  initialValues?: Partial<ISectionCreate | ISectionUpdate | ISection>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const SectionForm: React.FC<SectionFormProps> = ({
  mode,
  sectionId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SECTION, { defaultValue: 'Section' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createSection, editSection, actionStatus } = useSections();
  const { batches, loadBatches } = useBatches();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadBatches({ page: 1, limit: 100 });
  }, [loadBatches]);

  const handleSubmit = async (values: Partial<ISection>) => {
    try {
      if (mode === 'create') {
        await createSection(values as ISectionCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/sections');
        }
      } else if (mode === 'edit' && sectionId) {
        await editSection(sectionId, values as ISectionUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/sections/${sectionId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
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

  // Submit button text helper
  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  // Form initial values only for edit mode
  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
    >
      <Form.Item
        name="batchId"
        label={t(LOCALE_KEYS.BATCH)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.BATCH) })}
          loading={batches.length === 0}
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {batches.map((batch) => (
            <Select.Option key={batch.id} value={batch.id}>
              {batch.name} ({batch.code})
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
        <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.NAME) })} />
      </Form.Item>

      <Form.Item
        name="code"
        label={t(LOCALE_KEYS.CODE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CODE) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.CODE) })} />
      </Form.Item>

      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

      <Form.Item
        name="remarks"
        label={t(LOCALE_KEYS.REMARKS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.REMARKS) }),
          },
        ]}
      >
        <TextArea rows={4} placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.REMARKS) })} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default SectionForm;

