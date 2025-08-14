'use client';

import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import StatusSelect from '@/components/ui/StatusSelect';

import {useCourses} from '@/hooks/useCourses';
import {useCourseTypes} from '@/hooks/useCourseTypes';
import {useDepartments} from '@/hooks/useDepartments';
import {useLocalization} from '@/hooks/useLocalization';
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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createCourse, editCourse, actionStatus } = useCourses();
  const { departments, loadDepartments } = useDepartments();
  const { courseTypes, loadCourseTypes } = useCourseTypes();
  const { scheduleTypes, loadScheduleTypes } = useScheduleTypes();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadCourseTypes({ page: 1, limit: 100 });
    loadScheduleTypes({ page: 1, limit: 100 });
    loadDepartments({ page: 1, limit: 100 });
  }, [loadCourseTypes, loadScheduleTypes, loadDepartments]);

  const handleSubmit = async (values: Partial<ICourse>) => {
    try {
      if (mode === 'create') {
        await createCourse(values as ICourseCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/courses');
        }
      } else if (mode === 'edit' && courseId) {
        await editCourse(courseId, values as ICourseUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/courses/${courseId}`);
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
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  const formContent = (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={mode === 'edit' ? initialValues : undefined}>
      <Form.Item
        name="departmentId"
        label={t(LOCALE_KEYS.DEPARTMENT)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.DEPARTMENT) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.DEPARTMENT) })}
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
        label={t(LOCALE_KEYS.NAME)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.NAME) }) }]}
      >
        <Input placeholder={t(LOCALE_KEYS.NAME)} />
      </Form.Item>

      <Form.Item
        name="code"
        label={t(LOCALE_KEYS.CODE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_CODE) }]}
      >
        <Input placeholder={t(LOCALE_KEYS.CODE)} />
      </Form.Item>

      <Form.Item
        name="courseTypeId"
        label={t(LOCALE_KEYS.COURSE_TYPE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.COURSE_TYPE) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COURSE_TYPE) })}
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
        label={t(LOCALE_KEYS.SCHEDULE_TYPE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.SCHEDULE_TYPE) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SCHEDULE_TYPE) })}
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
        label={t(LOCALE_KEYS.DURATION_IN_SEMESTERS)}
        rules={[
          { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.DURATION_IN_SEMESTERS) }) },
        ]}
      >
        <InputNumber
          placeholder={t(LOCALE_KEYS.DURATION_IN_SEMESTERS)}
          min={1}
          max={20}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label={t(LOCALE_KEYS.DESCRIPTION)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) }) }]}
      >
        <Input.TextArea placeholder={t(LOCALE_KEYS.DESCRIPTION)} rows={4} />
      </Form.Item>

      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.STATUS) }) }]}
      >
        <StatusSelect preset="lifecycle" />
      </Form.Item>

      <Form.Item name="remarks" label={t(LOCALE_KEYS.REMARKS)}>
        <Input.TextArea rows={3} />
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

  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default CourseForm;
