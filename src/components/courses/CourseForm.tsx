'use client';

import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import StatusSelect from '@/components/ui/StatusSelect';

import {useCourses} from '@/hooks/useCourses';
import {useCourseTypes} from '@/hooks/useCourseTypes';
import {useDepartments} from '@/hooks/useDepartments';
import {useScheduleTypes} from '@/hooks/useScheduleTypes';

import {Status} from '@/types/common';
import {ICourse, ICourseCreate, ICourseUpdate} from '@/types/course';
import {getErrorMessage} from '@/types/errors';
import FormLayout from '../layout/FormLayout';


interface CourseFormProps {
  mode: 'create' | 'edit';
  courseId?: number;
  initialValues?: Partial<ICourseCreate | ICourseUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  mode,
  courseId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const t = useTranslations();
  const entityName = t('course');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createCourse, editCourse, actionStatus } = useCourses();
  const { departments, loadDepartments } = useDepartments();
  const { courseTypes, loadCourseTypes } = useCourseTypes();
  const { scheduleTypes, loadScheduleTypes } = useScheduleTypes();

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
    if (departments.length === 0) {
      loadDepartments();
    }
  }, [departments.length, loadDepartments]);

  useEffect(() => {
    loadCourseTypes({ page: 1, limit: 100 });
    loadScheduleTypes({ page: 1, limit: 100 });
  }, [loadCourseTypes, loadScheduleTypes]);

  const handleSubmit = async (values: Partial<ICourse>) => {
    try {
      if (mode === 'create') {
        await createCourse(values as ICourseCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/courses');
        }
      } else if (mode === 'edit' && courseId) {
        await editCourse(courseId, values as ICourseUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/courses/${courseId}`);
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
        name="departmentId"
        label={t('department')}
        rules={[{ required: true, message: t('required_field', { field: t('department') }) }]}
      >
        <Select
          placeholder={t('select_department')}
          loading={departments.length === 0}
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {departments.map((department) => (
            <Select.Option key={department.id} value={department.id}>
              {department.name} ({department.code})
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
        name="courseTypeId"
        label={t('courseType')}
        rules={[{ required: true, message: t('required_field', { field: t('courseType') }) }]}
      >
        <Select
          placeholder={t('select_courseType')}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {courseTypes.map((ct) => (
            <Select.Option key={ct.id} value={ct.id}>
              {ct.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="scheduleTypeId"
        label={t('scheduleType')}
        rules={[{ required: true, message: t('required_name', { name: t('scheduleType') }) }]}
      >
        <Select
          placeholder={t('select_name', { name: t('scheduleType') })}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {scheduleTypes.map((st) => (
            <Select.Option key={st.id} value={st.id}>
              {st.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="durationInSemesters"
        label={t('durationInSemesters')}
        rules={[
          { required: true, message: t('required_field', { field: t('durationInSemesters') }) },
        ]}
      >
        <InputNumber
          placeholder={t('enter_durationInSemesters')}
          min={1}
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
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default CourseForm;
