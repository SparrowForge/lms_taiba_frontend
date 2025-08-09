'use client';

import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';


import StatusSelect from '@/components/ui/StatusSelect';

import {useCourses} from '@/hooks/useCourses';
import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {ISubject, ISubjectCreate, ISubjectUpdate} from '@/types/subject';

interface SubjectFormProps {
  mode: 'create' | 'edit';
  subjectId?: number;
  initialValues?: Partial<ISubjectCreate | ISubjectUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  mode,
  subjectId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('subject');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createSubject, editSubject, actionStatus } = useSubjects();
  const { courses, loadCourses } = useCourses();

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

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses();
    }
  }, [courses.length, loadCourses]);

  const handleSubmit = async (values: Partial<ISubject>) => {
    try {
      if (mode === 'create') {
        await createSubject(values as ISubjectCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/subjects');
        }
      } else if (mode === 'edit' && subjectId) {
        await editSubject(subjectId, values as ISubjectUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/subjects/${subjectId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', {
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
        // Use the helper function for other error types
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
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues}>
      <Form.Item
        name="courseId"
        label={t('course')}
        rules={[{ required: true, message: t('required_field', { field: t('course') }) }]}
      >
        <Select
          placeholder={t('select_course')}
          loading={courses.length === 0}
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {courses.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('required_field', { field: t('name') }) }]}
      >
        <Input placeholder={t('enter_name', { name: t('name') })} />
      </Form.Item>

      <Form.Item
        name="code"
        label={t('code')}
        rules={[{ required: true, message: t('required_field', { field: t('code') }) }]}
      >
        <Input placeholder={t('enter_code')} />
      </Form.Item>

      <Form.Item
        name="creditHours"
        label={t('creditHours')}
        rules={[{ required: true, message: t('required_field', { field: t('creditHours') }) }]}
      >
        <Input placeholder={t('enter_creditHours')} />
      </Form.Item>

      <Form.Item
        name="theoryHours"
        label={t('theoryHours')}
        rules={[{ required: true, message: t('required_field', { field: t('theoryHours') }) }]}
      >
        <InputNumber
          placeholder={t('enter_theoryHours')}
          min={0}
          max={20}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="practicalHours"
        label={t('practicalHours')}
        rules={[{ required: true, message: t('required_field', { field: t('practicalHours') }) }]}
      >
        <InputNumber
          placeholder={t('enter_practicalHours')}
          min={0}
          max={20}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label={t('description')}
        rules={[{ required: true, message: t('required_field', { field: t('description') }) }]}
      >
        <Input.TextArea placeholder={t('enter_description')} rows={4} />
      </Form.Item>

      <Form.Item name="prerequisite" label={t('prerequisite')}>
        <Input />
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
          <Button onClick={handleCancel}>{t('cancel')}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? (
    formContent
  ) : (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {formContent}
      </div>
    </div>
  );
};

export default SubjectForm;
