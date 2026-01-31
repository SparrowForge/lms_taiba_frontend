'use client';

import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useStudentEducations } from '@/hooks/useStudentEducations';
import { useStudents } from '@/hooks/useStudents';

import { getErrorMessage } from '@/types/errors';
import { IStudentEducationCreate, IStudentEducationUpdate } from '@/types/studentEducation';

import FormLayout from '../layout/FormLayout';
import QuickAddRouteButton from '../ui/QuickAddRouteButton';

interface StudentEducationFormProps {
  mode: 'create' | 'edit';
  studentEducationId?: number;
  initialValues?: Partial<IStudentEducationCreate | IStudentEducationUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const StudentEducationForm: React.FC<StudentEducationFormProps> = ({
  mode,
  studentEducationId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT_EDUCATION, { defaultValue: 'Student Education' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createStudentEducation, editStudentEducation, actionStatus } = useStudentEducations();
  const { students, loadStudents } = useStudents();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadStudents({ page: 1, limit: 100 });
  }, [loadStudents]);

  const handleSubmit = async (
    values: Partial<IStudentEducationCreate | IStudentEducationUpdate>,
  ) => {
    try {
      const payload = { ...values };
      if (mode === 'create') {
        await createStudentEducation(payload as IStudentEducationCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/student-educations');
        }
      } else if (mode === 'edit' && studentEducationId) {
        await editStudentEducation(studentEducationId, payload as IStudentEducationUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/student-educations/${studentEducationId}`);
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
    <Form
      form={form}
      layout="vertical"
      initialValues={mode === 'edit' ? initialValues : undefined}
      onFinish={handleSubmit}
      disabled={actionStatus.status === Status.LOADING}
    >
      <Row gutter={8}>
        <Col flex="1">
          <Form.Item
            name="studentId"
            label={t(LOCALE_KEYS.STUDENT)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STUDENT) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_STUDENT, { defaultValue: 'Select Student' })}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={students.map((student) => ({
                label: student.name,
                value: student.id,
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label=" " colon={false}>
            <QuickAddRouteButton route="/students" iconOnly buttonType="dashed" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="degreeType"
        label={t(LOCALE_KEYS.DEGREE_TYPE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DEGREE_TYPE) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_DEGREE_TYPE, { defaultValue: 'Select Degree Type' })}
          options={[
            { label: 'High School', value: 'High School' },
            { label: 'Diploma', value: 'Diploma' },
            { label: 'Bachelor', value: 'Bachelor' },
            { label: 'Master', value: 'Master' },
            { label: 'PhD', value: 'PhD' },
          ]}
        />
      </Form.Item>

      <Form.Item name="foundationCourse" label={t(LOCALE_KEYS.FOUNDATION_COURSE)}>
        <Input
          placeholder={t(LOCALE_KEYS.ENTER_FOUNDATION_COURSE, {
            defaultValue: 'Enter foundation course',
          })}
        />
      </Form.Item>

      <Form.Item
        name="degreeName"
        label={t(LOCALE_KEYS.DEGREE_NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DEGREE_NAME) }),
          },
        ]}
      >
        <Input
          placeholder={t(LOCALE_KEYS.ENTER_DEGREE_NAME, { defaultValue: 'Enter degree name' })}
        />
      </Form.Item>

      <Form.Item
        name="passingYear"
        label={t(LOCALE_KEYS.PASSING_YEAR)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PASSING_YEAR) }),
          },
        ]}
      >
        <InputNumber
          placeholder={t(LOCALE_KEYS.ENTER_PASSING_YEAR, { defaultValue: 'Enter passing year' })}
          min={1900}
          max={new Date().getFullYear() + 10}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="institute"
        label={t(LOCALE_KEYS.INSTITUTE)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.INSTITUTE) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_INSTITUTE, { defaultValue: 'Enter institute' })} />
      </Form.Item>

      <Form.Item
        name="result"
        label={t(LOCALE_KEYS.RESULT)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.RESULT) }),
          },
        ]}
      >
        <Input
          placeholder={t(LOCALE_KEYS.ENTER_RESULT, {
            defaultValue: 'Enter result (e.g., 3.7 GPA)',
          })}
        />
      </Form.Item>

      <Form.Item
        name="groupMajor"
        label={t(LOCALE_KEYS.GROUP_MAJOR)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.GROUP_MAJOR) }),
          },
        ]}
      >
        <Input
          placeholder={t(LOCALE_KEYS.ENTER_GROUP_MAJOR, { defaultValue: 'Enter group/major' })}
        />
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

export default StudentEducationForm;
