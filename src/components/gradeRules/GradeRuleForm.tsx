'use client';

import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions';
import { Status } from '@/enums';

import FormLayout from '@/components/layout/FormLayout';
import { StatusSelect } from '@/components/ui/StatusSelect';

import { useCourses } from '@/hooks/useCourses';
import { useGradeRules } from '@/hooks/useGradeRules';
import { useLocalization } from '@/hooks/useLocalization';

import { getErrorMessage } from '@/types/errors';
import { IGradeRule, IGradeRuleCreate, IGradeRuleUpdate } from '@/types/gradeRule';

interface GradeRuleFormProps {
  mode: 'create' | 'edit';
  gradeRuleId?: number;
  initialValues?: Partial<IGradeRuleCreate | IGradeRuleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const GradeRuleForm: React.FC<GradeRuleFormProps> = ({
  mode,
  gradeRuleId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.GRADE_RULE, { defaultValue: 'Grade Rule' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createGradeRule, editGradeRule, actionStatus } = useGradeRules();
  const { courses, loadCourses } = useCourses();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
    // Load courses for dropdown
    loadCourses({ page: 1, limit: 100 });
  }, [mode, form, loadCourses]);

  const handleSubmit = async (values: Partial<IGradeRule>) => {
    try {
      const payload = { ...values };
      if (mode === 'create') {
        await createGradeRule(payload as IGradeRuleCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/grade-rules');
        }
      } else if (mode === 'edit' && gradeRuleId) {
        await editGradeRule(gradeRuleId, payload as IGradeRuleUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/grade-rules/${gradeRuleId}`);
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
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
    >
      <Form.Item
        name="grade"
        label={t(LOCALE_KEYS.GRADE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.GRADE) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.GRADE)} />
      </Form.Item>

      <Form.Item
        name="courseId"
        label={t(LOCALE_KEYS.COURSE)}
        rules={[
          {
            required: false,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.COURSE) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_COURSE)}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={courses.map((course) => ({
            value: course.id,
            label: course.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="minMarks"
        label={t(LOCALE_KEYS.MIN_MARKS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MIN_MARKS) }),
          },
          {
            type: 'number',
            min: 0,
            message: 'Minimum marks must be at least 0',
          },
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.MIN_MARKS)}
        />
      </Form.Item>

      <Form.Item
        name="maxMarks"
        label={t(LOCALE_KEYS.MAX_MARKS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MAX_MARKS) }),
          },
          {
            type: 'number',
            min: 0,
            message: 'Maximum marks must be at least 0',
          },
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.MAX_MARKS)}
        />
      </Form.Item>

      <Form.Item
        name="gradePoint"
        label={t(LOCALE_KEYS.GRADE_POINT)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.GRADE_POINT) }),
          },
          {
            type: 'number',
            min: 0,
            message: 'Grade point must be at least 0',
          },
        ]}
      >
        <InputNumber
          min={0}
          max={4}
          step={0.1}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.GRADE_POINT)}
        />
      </Form.Item>

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
        <Input placeholder={t(LOCALE_KEYS.REMARKS)} />
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
        <StatusSelect options={ENTITY_STATUS_OPTIONS} />
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

export default GradeRuleForm;
